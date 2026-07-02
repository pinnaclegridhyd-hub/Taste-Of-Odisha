import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  imageUrl: string;
  linkUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    linkUrl: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    ctaText: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: Date,
    endDate: Date,
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Banner;
}

export default mongoose.models.Banner ||
  mongoose.model<IBanner>('Banner', BannerSchema);
