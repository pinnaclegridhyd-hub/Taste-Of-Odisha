import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';
import { generateOrderId, getEffectivePrice, getDeliveryCharge } from '@/lib/helpers';
import { createRazorpayOrder } from '@/lib/razorpay';
import { validateStock } from '@/lib/pricing';
import { getClientIP, createOrderLimiter } from '@/lib/middleware';
import { VALID_COUPONS, calculateCartPrice } from '@/lib/pricing';
import { formatPrice } from '@/lib/helpers';
import { COD_ADVANCE_AMOUNT } from '@/lib/constants';

/**
 * POST /api/create-order
 * Create a new order and initialize Razorpay payment
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
    const { items, shippingInfo, phoneNumber, couponCode, paymentMethod = 'online' } = body;

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

    if (paymentMethod !== 'online' && paymentMethod !== 'cod') {
      return NextResponse.json(
        { error: 'Invalid payment method selection' },
        { status: 400 }
      );
    }

    // Fetch products and validate stock
    const productIds = items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const pricingBreakdown = await calculateCartPrice(items, productMap, couponCode);
    const { subtotal, deliveryCharge, discount, total } = pricingBreakdown;

    // Validate COD threshold
    if (paymentMethod === 'cod' && total <= COD_ADVANCE_AMOUNT) {
      return NextResponse.json(
        { error: `Cash on Delivery is only available for orders above ₹${COD_ADVANCE_AMOUNT}. Please choose Pay Online.` },
        { status: 400 }
      );
    }

    const orderItems: any[] = [];
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) continue;
      
      const stockValidation = validateStock(product, item.quantity, item.variantName);
      if (!stockValidation.valid) {
        return NextResponse.json({ error: stockValidation.message }, { status: 400 });
      }

      let basePrice = product.price;
      if (item.variantName && product.variants) {
        const variant = product.variants.find((v: any) => v.name === item.variantName);
        if (variant) basePrice = variant.price;
      }

      const effectivePrice = getEffectivePrice(basePrice, product.discount);
      orderItems.push({
        productId: product._id,
        name: product.name,
        variantName: item.variantName || null,
        price: effectivePrice,
        quantity: item.quantity,
      });
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Determine the amount to be paid now via Razorpay
    const paymentAmountNow = paymentMethod === 'cod' ? COD_ADVANCE_AMOUNT : total;

    // Create Razorpay order (or mock it if the amount is zero, e.g. 100% off coupon)
    let razorpayOrder;
    if (paymentAmountNow <= 0) {
      razorpayOrder = {
        id: `mock_order_free_${Math.random().toString(36).substring(2, 10)}`,
        amount: 0,
        currency: 'INR',
        status: 'created'
      };
    } else {
      try {
        razorpayOrder = await createRazorpayOrder(
          paymentAmountNow,
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
    }

    // Create order in database using direct collection access to bypass cached middlewares
    const { connection } = await connectDB();
    const orderCollection = connection.db.collection('orders');

    const orderData = {
      orderId,
      phoneNumber,
      items: orderItems,
      total,
      subtotal,
      deliveryCharge,
      discount,
      couponCode: couponCode?.toUpperCase() || null,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      advancePaid: 0,
      balanceDue: total, // Set to total before payment confirmation
      razorpayOrderId: razorpayOrder.id,
      shippingAddress: shippingInfo,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await orderCollection.insertOne(orderData);

    log.order(`Created order ${orderId}`, {
      total,
      itemCount: orderItems.length,
      razorpayOrderId: razorpayOrder.id,
      paymentMethod,
      paymentAmountNow,
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: orderData.orderId,
        razorpayOrderId: razorpayOrder.id,
        amount: paymentAmountNow,
        paymentMethod,
        total,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error: any) {
    log.error('Failed to create order', error);
    console.error('OUTER ERROR IN CREATE-ORDER:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
