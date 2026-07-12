import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdminKey } from '@/lib/middleware';
import { log } from '@/lib/analytics';

/**
 * DELETE /api/admin/coupons/[id]
 * Delete a coupon by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!validateAdminKey(authHeader ?? undefined)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Coupon ID is required' }, { status: 400 });
    }

    const deleted = await Coupon.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
    }

    log.api('Admin deleted coupon', { id, code: deleted.code });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error: any) {
    log.error('Admin failed to delete coupon', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
