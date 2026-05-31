import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdminKey } from '@/lib/middleware';
import { log } from '@/lib/analytics';

/**
 * GET /api/admin/products
 * Fetch all products, or a single product by ?id= (for edit page)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!validateAdminKey(authHeader ?? undefined)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      log.api('Admin fetched single product', { id });
      return NextResponse.json({ success: true, data: product });
    }

    const products = await Product.find().sort({ createdAt: -1 });
    log.api('Admin fetched products', { count: products.length });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    log.error('Admin failed to fetch products', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products
 * Update a product by ID (from edit page)
 */
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!validateAdminKey(authHeader ?? undefined)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    log.api('Admin updated product', { id, name: product.name });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    log.error('Admin failed to update product', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
