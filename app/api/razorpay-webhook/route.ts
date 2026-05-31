import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';
import { verifyWebhookSignature } from '@/lib/razorpay';

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
      if (order.paymentStatus === 'paid') {
        log.webhook('Order already paid (webhook idempotent)', {
          orderId: order.orderId,
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
          product.stockQuantity -= item.quantity;
          if (product.stockQuantity < 0) {
            product.stockQuantity = 0;
          }
          await product.save();
        }
      }

      log.webhook(`Payment authorized via webhook`, {
        orderId: order.orderId,
        razorpayPaymentId,
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
