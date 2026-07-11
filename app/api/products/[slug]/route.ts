import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';
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
 * GET /api/products/[slug]
 * Fetch a single product by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    log.api('Fetched product', {
      productId: product._id,
      slug: product.slug,
    });

    return NextResponse.json({
      success: true,
      data: normalizeProductForResponse(product),
    });
  } catch (error) {
    log.error('Failed to fetch product', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[slug]
 * Update a product by slug (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_KEY;

    if (!adminKey || !authHeader || authHeader.replace('Bearer ', '') !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, category, price, discount, images, inStock, stockQuantity, artisanName, description, variants, weight } = body;

    // Update fields
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (discount !== undefined) product.discount = discount;
    if (images !== undefined) product.images = normalizeProductImageList(images);
    if (inStock !== undefined) product.inStock = inStock;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (artisanName !== undefined) product.artisanName = artisanName;
    if (description !== undefined) product.description = description;
    if (weight !== undefined) product.weight = weight;
    if (variants !== undefined) {
      if (!Array.isArray(variants) || variants.some((variant) => !variant.name || !Number.isFinite(variant.price) || !Number.isFinite(variant.stockQuantity) || variant.price < 0 || variant.stockQuantity < 0)) {
        return NextResponse.json(
          { success: false, error: 'Each size option needs a name, valid price and stock quantity' },
          { status: 400 }
        );
      }
      product.variants = variants.map((variant) => ({
        ...variant,
        image: normalizeProductImagePath(variant.image),
      }));
    }

    // Explicitly regenerate slug if name changed
    if (name && name !== product.name) {
      const { generateUniqueSlug } = await import('@/lib/slug-utils');
      product.slug = await generateUniqueSlug(Product, name, product._id);
    }

    await product.save();

    log.api('Updated product', {
      productId: product._id,
      slug: product.slug,
    });

    return NextResponse.json({
      success: true,
      data: normalizeProductForResponse(product),
    });
  } catch (error: any) {
    log.error('Failed to update product', error);

    // Handle duplicate key error (MongoDB error 11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A product with this name or slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[slug]
 * Delete a product by slug (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_KEY;

    if (!adminKey || !authHeader || authHeader.replace('Bearer ', '') !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const product = await Product.findOneAndDelete({ slug });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    log.api('Deleted product', {
      productId: product._id,
      slug: product.slug,
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Product deleted' },
    });
  } catch (error) {
    log.error('Failed to delete product', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
