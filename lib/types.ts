/**
 * Global types for the application
 */

export interface Cart {
  items: CartItem[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  mobile: string;
  pincode: string;
  city: string;
  state: string;
  addressLine: string;
}

export interface CheckoutPayload {
  items: CartItem[];
  shippingInfo: ShippingInfo;
  phoneNumber: string;
}

export interface PaymentVerificationPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
