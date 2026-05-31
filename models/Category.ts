import mongoose, { Schema, Document } from 'mongoose';
import { generateUniqueSlug } from '@/lib/slug-utils';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Slug generation and uniqueness are now handled in the API routes 
// to avoid middleware conflicts in the development environment.

// Force re-compilation in development to resolve stale middleware errors
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Category;
}

export default mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);
