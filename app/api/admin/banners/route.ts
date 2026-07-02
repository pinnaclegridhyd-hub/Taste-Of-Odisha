import { connectDB } from '@/lib/db';
import Banner from '@/models/Banner';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdminKey } from '@/lib/middleware';
import { log } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/banners
 * Fetch all banners for banner management
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!validateAdminKey(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const banners = await Banner.find().sort({ displayOrder: 1 });

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error: any) {
    log.error('Admin failed to fetch banners', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/banners
 * Create new banner
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!validateAdminKey(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { imageUrl, linkUrl, title, subtitle, ctaText, displayOrder, isActive, startDate, endDate } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const banner = await Banner.create({
      imageUrl,
      linkUrl,
      title,
      subtitle,
      ctaText,
      displayOrder: Number(displayOrder || 0),
      isActive: isActive !== false,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    log.api('Admin created banner', { id: banner._id });

    return NextResponse.json({
      success: true,
      data: banner,
    });
  } catch (error: any) {
    log.error('Admin failed to create banner', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/banners
 * Update a banner or display order
 */
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!validateAdminKey(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    // Bulk displayOrder updates support
    if (body.reorder && Array.isArray(body.reorder)) {
      for (const item of body.reorder) {
        await Banner.findByIdAndUpdate(item.id, { displayOrder: Number(item.displayOrder) });
      }
      return NextResponse.json({ success: true, message: 'Banners reordered successfully' });
    }

    const { id, imageUrl, linkUrl, title, subtitle, ctaText, displayOrder, isActive, startDate, endDate } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (ctaText !== undefined) updateData.ctaText = ctaText;
    if (displayOrder !== undefined) updateData.displayOrder = Number(displayOrder);
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Handle date fields safely
    updateData.startDate = startDate ? new Date(startDate) : null;
    updateData.endDate = endDate ? new Date(endDate) : null;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    log.api('Admin updated banner', { id });

    return NextResponse.json({
      success: true,
      data: banner,
    });
  } catch (error: any) {
    log.error('Admin failed to update banner', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/banners
 * Delete a banner
 */
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!validateAdminKey(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    log.api('Admin deleted banner', { id });

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error: any) {
    log.error('Admin failed to delete banner', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
