import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { getClientIP, verifyPaymentLimiter } from '@/lib/middleware';

/**
 * POST /api/verify-payment
 * Verify Razorpay payment and update order status
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!verifyPaymentLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    // Verify signature
    let isSignatureValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    // Heritage Test Mode: Bypass validation for mock orders
    if (razorpayOrderId.startsWith('mock_order_')) {
       isSignatureValid = true;
    }

    if (!isSignatureValid) {
      log.payment('Invalid payment signature', {
        razorpayOrderId,
        razorpayPaymentId,
      });
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Find order and update using direct collection access to bypass cached middlewares
    const { connection } = await connectDB();
    const orderCollection = connection.db.collection('orders');
    const productCollection = connection.db.collection('products');

    const order = await orderCollection.findOne({ razorpayOrderId });

    if (!order) {
      log.error('Order not found', { razorpayOrderId });
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if already paid (idempotency)
    if (order.paymentStatus === 'paid') {
      log.payment('Order already paid (idempotent request)', {
        orderId: order.orderId,
      });
      return NextResponse.json({
        success: true,
        data: { orderId: order.orderId, message: 'Order already processed' },
      });
    }

    // Update order with payment details
    await orderCollection.updateOne(
      { _id: order._id },
      { 
        $set: { 
          paymentStatus: 'paid', 
          status: 'processing', 
          razorpayPaymentId,
          updatedAt: new Date()
        } 
      }
    );

    // Deduct stock for each product
    for (const item of order.items) {
      await productCollection.updateOne(
        { _id: item.productId },
        { 
          $inc: { stockQuantity: -item.quantity },
          $set: { updatedAt: new Date() } 
        }
      );

      log.stock(`Deducted stock`, {
        productId: item.productId,
        quantity: item.quantity
      });
    }

    log.payment(`Payment successful`, {
      orderId: order.orderId,
      amount: order.total,
      razorpayPaymentId,
    });

    return NextResponse.json({
      success: true,
      data: { orderId: order.orderId },
    });
  } catch (error) {
    log.error('Failed to verify payment', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
