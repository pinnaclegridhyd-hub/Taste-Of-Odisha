import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/analytics';
import mongoose from 'mongoose';
import { generateUniqueSlug } from '@/lib/slug-utils';

/**
 * GET /api/categories/[id]
 * Fetch a single category by slug or ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const category = await Category.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(id) ? id : null },
        { slug: id }
      ].filter(q => q !== null)
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

/**
 * PUT /api/categories/[id]
 * Update a category (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_KEY;

    if (!adminKey || !authHeader || authHeader.replace('Bearer ', '') !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    // Find category first
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Update fields
    const allowedUpdates = ['name', 'description', 'image', 'order'];
    allowedUpdates.forEach(update => {
      if (body[update] !== undefined) {
        (category as any)[update] = body[update];
      }
    });

    // Explicitly generate slug if name changed
    if (body.name && body.name !== category.name) {
      category.slug = await generateUniqueSlug(Category, body.name, category._id);
    }

    // If name is explicitly provided but is the same, Mongoose isModified might not trigger.
    // But our pre-save hook handles !this.slug too.
    
    await category.save();

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error('Failed to update category:', error);

    // Handle duplicate key error (MongoDB error 11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A category with this name or slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update category' }, 
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a category (admin only)
 * SAFETY: Prevent deletion if category is in use by products
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_KEY;

    if (!adminKey || !authHeader || authHeader.replace('Bearer ', '') !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category is in use
    const productCount = await Product.countDocuments({ category: category.slug });
    if (productCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category: ${productCount} products are currently associated with it. Please reassign or delete the products first.` 
      }, { status: 400 });
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

