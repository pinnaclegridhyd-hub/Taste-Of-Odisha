import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';

/**
 * GET /api/orders/[id]
 * Fetch a single order by orderId
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const order = await Order.findOne({ orderId: id }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    log.api(`Fetched order detail for: ${order.orderId}`);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    log.error('Failed to fetch order detail', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order detail' },
      { status: 500 }
    );
  }
}
