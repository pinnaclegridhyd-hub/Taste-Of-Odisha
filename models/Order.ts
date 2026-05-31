import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  name: string;
  mobile: string;
  pincode: string;
  city: string;
  state: string;
  addressLine: string;
}

export interface IOrder extends Document {
  orderId: string;
  phoneNumber: string;
  items: IOrderItem[];
  total: number;
  deliveryCharge: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  shippingAddress: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingAddressSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  addressLine: {
    type: String,
    required: true,
  },
});

const OrderItemSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  variantName: String,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: String,
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Timestamps handled by schema options

export default mongoose.models.Order ||
  mongoose.model<IOrder>('Order', OrderSchema);
