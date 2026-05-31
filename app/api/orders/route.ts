import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';
import { generateOrderId, getEffectivePrice, getDeliveryCharge } from '@/lib/helpers';
import { createRazorpayOrder } from '@/lib/razorpay';
import { validateStock } from '@/lib/pricing';
import { getClientIP, createOrderLimiter } from '@/lib/middleware';

/**
 * GET /api/orders
 * Fetch orders by phone number
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phone');

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const orders = await Order.find({ phoneNumber }).sort({ createdAt: -1 });

    log.api(`Fetched ${orders.length} orders for phone: ${phoneNumber}`);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    log.error('Failed to fetch orders', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Create a new order (Same as /api/create-order)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!createOrderLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { items, shippingInfo, phoneNumber } = body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    if (!shippingInfo || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing shipping information' },
        { status: 400 }
      );
    }

    // Fetch products and validate stock
    const productIds = items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      // Validate stock
      const stockValidation = validateStock(product, item.quantity);
      if (!stockValidation.valid) {
        return NextResponse.json(
          { error: stockValidation.message },
          { status: 400 }
        );
      }

      const effectivePrice = getEffectivePrice(product.price, product.discount);
      const itemTotal = effectivePrice * item.quantity;

      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: effectivePrice,
        quantity: item.quantity,
      });
    }

    // Calculate delivery charge and total
    const deliveryCharge = getDeliveryCharge(subtotal);
    const total = subtotal + deliveryCharge;

    // Generate order ID
    const orderId = generateOrderId();

    // Create Razorpay order
    let razorpayOrder;
    try {
      razorpayOrder = await createRazorpayOrder(
         total,
         orderId,
         undefined,
         phoneNumber
      );
    } catch (err) {
      log.error('Failed to create Razorpay order', err);
      return NextResponse.json(
        { error: 'Failed to process payment. Please try again.' },
        { status: 500 }
      );
    }

    // Create order in database
    const order = await Order.create({
      orderId,
      phoneNumber,
      items: orderItems,
      total,
      deliveryCharge,
      status: 'pending',
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id,
      shippingAddress: shippingInfo,
    });

    log.order(`Created order ${orderId}`, {
      total,
      itemCount: orderItems.length,
      razorpayOrderId: razorpayOrder.id,
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        razorpayOrderId: razorpayOrder.id,
        amount: total,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    log.error('Failed to create order', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
