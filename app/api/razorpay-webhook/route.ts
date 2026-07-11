import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { sendOrderConfirmationEmail } from '@/lib/notifications';

/**
 * POST /api/razorpay-webhook
 * Webhook endpoint for Razorpay payment events
 * Used as a backup to frontend verification
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 400 }
      );
    }

    const rawBody = await request.text();

    // Verify webhook signature
    const isSignatureValid = verifyWebhookSignature(rawBody, signature);

    if (!isSignatureValid) {
      log.webhook('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = JSON.parse(rawBody);

    // Handle payment.authorized event
    if (body.event === 'payment.authorized') {
      const paymentData = body.payload.payment.entity;
      const razorpayOrderId = paymentData.order_id;
      const razorpayPaymentId = paymentData.id;

      // Find order
      const order = await Order.findOne({ razorpayOrderId });

      if (!order) {
        log.webhook('Order not found for webhook', { razorpayOrderId });
        return NextResponse.json({ success: true }); // Return 200 to acknowledge
      }

      // Check if already paid (idempotency)
      // NOTE: verify-payment sets status to 'fully_paid' or 'advance_paid' — not 'paid'
      // This webhook must guard against ALL paid states to prevent double stock deduction
      const alreadyPaid = ['paid', 'fully_paid', 'advance_paid'].includes(order.paymentStatus);
      if (alreadyPaid) {
        log.webhook('Order already paid (webhook idempotent)', {
          orderId: order.orderId,
          paymentStatus: order.paymentStatus,
        });
        return NextResponse.json({ success: true });
      }

      // Update order
      order.paymentStatus = 'paid';
      order.status = 'processing';
      order.razorpayPaymentId = razorpayPaymentId;

      await order.save();

      // Deduct stock
      for (const item of order.items) {
        const product = await Product.findById(item.productId);

        if (product) {
          if (item.variantName) {
            const variant = product.variants?.find((entry: any) => entry.name === item.variantName);
            if (variant) variant.stockQuantity = Math.max(0, variant.stockQuantity - item.quantity);
          } else {
            product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
          }
          await product.save();
        }
      }

      log.webhook(`Payment authorized via webhook`, {
        orderId: order.orderId,
        razorpayPaymentId,
      });

      await sendOrderConfirmationEmail({
        orderId: order.orderId,
        customerName: order.shippingAddress?.name || 'Valued Customer',
        customerEmail: order.shippingAddress?.email || '',
        customerPhone: order.shippingAddress?.mobile || order.phoneNumber || '',
        items: order.items.map((item: any) => ({ name: `${item.name}${item.variantName ? ` (${item.variantName})` : ''}`, quantity: item.quantity, price: item.price })),
        total: order.total,
        deliveryCharge: order.deliveryCharge || 0,
        advancePaid: order.advancePaid || 0,
        balanceDue: order.balanceDue || 0,
        paymentMethod: order.paymentMethod,
        shippingAddress: {
          addressLine1: order.shippingAddress?.addressLine || '',
          city: order.shippingAddress?.city || '',
          state: order.shippingAddress?.state || '',
          pincode: order.shippingAddress?.pincode || '',
        },
      });
    }

    // Handle payment.failed event
    if (body.event === 'payment.failed') {
      const paymentData = body.payload.payment.entity;
      const razorpayOrderId = paymentData.order_id;

      const order = await Order.findOne({ razorpayOrderId });

      if (order) {
        order.paymentStatus = 'failed';
        await order.save();

        log.webhook(`Payment failed via webhook`, {
          orderId: order.orderId,
          reason: paymentData.description,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    log.error('Webhook processing error', error);
    // Return 200 to acknowledge, even if there's an error
    return NextResponse.json({ success: true });
  }
}
