import { connectDB } from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdminKey } from '@/lib/middleware';
import { log } from '@/lib/analytics';

/**
 * GET /api/admin/coupons
 * Fetch all coupons
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!validateAdminKey(authHeader ?? undefined)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const coupons = await Coupon.find().sort({ createdAt: -1 });
    log.api('Admin fetched coupons', { count: coupons.length });

    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    log.error('Admin failed to fetch coupons', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/coupons
 * Create a new coupon
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!validateAdminKey(authHeader ?? undefined)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { code, discountPercentage, expiresAt, isActive } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }

    if (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 1) {
      return NextResponse.json({ success: false, error: 'Discount must be a number between 0 and 1 (e.g. 0.1 for 10%)' }, { status: 400 });
    }

    const uppercaseCode = code.trim().toUpperCase();

    // Check if duplicate code exists
    const existing = await Coupon.findOne({ code: uppercaseCode });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 400 });
    }

    const coupon = await Coupon.create({
      code: uppercaseCode,
      discountPercentage,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      isActive: isActive !== false,
    });

    log.api('Admin created coupon', { code: coupon.code, discountPercentage: coupon.discountPercentage });

    return NextResponse.json({ success: true, data: coupon });
  } catch (error: any) {
    log.error('Admin failed to create coupon', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
