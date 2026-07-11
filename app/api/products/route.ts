import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';
import { generateUniqueSlug } from '@/lib/slug-utils';
import { normalizeProductImageList, normalizeProductImagePath } from '@/lib/image-path';

function normalizeProductForResponse(product: any) {
  const raw = product.toObject ? product.toObject() : product;
  return {
    ...raw,
    images: normalizeProductImageList(raw.images),
    variants: Array.isArray(raw.variants)
      ? raw.variants.map((variant: any) => ({
          ...variant,
          image: normalizeProductImagePath(variant.image),
        }))
      : [],
  };
}

/**
 * GET /api/products
 * Fetch all products or filter by category
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query: any = {};
    if (category && category !== 'all') {
      // Perform case-insensitive search to match 'Food' with 'food', etc.
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const products = await Product.find(query).select(
      'name slug category price weight variants discount images inStock stockQuantity artisanName description'
    );

    log.api('Fetched products', {
      count: products.length,
      category: category || 'all',
    });

    return NextResponse.json({
      success: true,
      data: products.map(normalizeProductForResponse),
    });
  } catch (error) {
    log.error('Failed to fetch products', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product (admin only)
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
    const {
      name,
      category,
      price,
      discount,
      images,
      inStock,
      stockQuantity,
      weight,
      variants,
      artisanName,
      description,
    } = body;

    // Validate required fields
    if (!name || !category || price === undefined || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (variants && (!Array.isArray(variants) || variants.some((variant) => !variant.name || !Number.isFinite(variant.price) || !Number.isFinite(variant.stockQuantity) || variant.price < 0 || variant.stockQuantity < 0))) {
      return NextResponse.json({ error: 'Each size option needs a name, valid price and stock quantity' }, { status: 400 });
    }

    // Always regenerate unique slug from name
    const slug = await generateUniqueSlug(Product, name);

    const normalizedVariants = Array.isArray(variants)
      ? variants.map((variant) => ({
          ...variant,
          image: normalizeProductImagePath(variant.image),
        }))
      : [];

    const product = await Product.create({
      name,
      slug,
      category,
      price,
      discount,
      images: normalizeProductImageList(images),
      inStock: inStock !== undefined ? inStock : true,
      stockQuantity: stockQuantity || 0,
      weight,
      variants: normalizedVariants,
      artisanName,
      description,
      origin: 'Odisha',
    });

    log.api('Created product', {
      productId: product._id,
      name: product.name,
      slug: product.slug,
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: any) {
    log.error('Failed to create product', error);

    // Handle duplicate key error (MongoDB error 11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A product with this name or slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
