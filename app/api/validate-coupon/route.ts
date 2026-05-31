import { NextRequest, NextResponse } from 'next/server';
import { calculateCartPrice } from '@/lib/pricing';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { log } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { items, couponCode } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your manifest is empty' }, { status: 400 });
    }

    await connectDB();
    const productIds = items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((p: any) => [p._id.toString(), p]));

    try {
      const breakdown = await calculateCartPrice(items, productMap, couponCode);
      
      if (couponCode && !breakdown.couponApplied) {
        return NextResponse.json({ error: 'Invalid or expired heritage code' }, { status: 400 });
      }

      log.api('Validated coupon', { couponCode, discount: breakdown.discount });

      return NextResponse.json({
        success: true,
        data: breakdown
      });
    } catch (pricingError: any) {
      return NextResponse.json({ error: pricingError.message }, { status: 400 });
    }
  } catch (error) {
    log.error('Coupon validation failed', error);
    return NextResponse.json({ error: 'Validation system temporarily unavailable' }, { status: 500 });
  }
}
