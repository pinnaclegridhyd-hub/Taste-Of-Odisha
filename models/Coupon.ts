import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number; // e.g. 0.1 for 10%
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [0, 'Discount cannot be negative'],
      max: [1, 'Discount cannot exceed 100% (1.0)'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Coupon;
}

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
