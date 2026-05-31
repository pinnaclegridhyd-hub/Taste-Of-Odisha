import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdminKey } from '@/lib/middleware';
import { log } from '@/lib/analytics';

/**
 * GET /api/admin/orders
 * Fetch all orders for admin
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!validateAdminKey(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 });

    log.api('Admin fetched orders', { count: orders.length });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    log.error('Admin failed to fetch orders', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/orders
 * Update order status
 */
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!validateAdminKey(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing orderId or status' },
        { status: 400 }
      );
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    log.api('Admin updated order status', {
      orderId,
      status,
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    log.error('Admin failed to update order', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
