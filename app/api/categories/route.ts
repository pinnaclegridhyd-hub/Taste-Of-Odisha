import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';
import { generateUniqueSlug } from '@/lib/slug-utils';

/**
 * GET /api/categories
 * Fetch all categories sorted by order
 */
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ order: 1 });
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Create a new category (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_KEY;

    if (!adminKey || !authHeader || authHeader.replace('Bearer ', '') !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, description, image, order } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Explicitly generate slug here to ensure it's available during validation
    const slug = await generateUniqueSlug(Category, name);

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      order: order || 0,
    });

    log.api('Created category', {
      categoryId: category._id,
      name: category.name,
      slug: category.slug,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create category:', error);
    
    // Handle duplicate key error (MongoDB error 11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A category with this name or slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
