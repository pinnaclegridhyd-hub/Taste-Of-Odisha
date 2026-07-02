import { connectDB } from '@/lib/db';
import Banner from '@/models/Banner';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const now = new Date();

    // Query active banners and respect start/end schedule dates
    const banners = await Banner.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } },
          ],
        },
      ],
    }).sort({ displayOrder: 1 });

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}
