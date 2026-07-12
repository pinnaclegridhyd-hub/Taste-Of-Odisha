import { IProduct } from '@/models/Product';
import { getEffectivePrice, getDeliveryCharge, formatPrice } from './helpers';

export interface CartItem {
  productId: string;
  variantName?: string;
  quantity: number;
}

export interface PricingBreakdown {
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  couponApplied?: string;
}

import { connectDB } from './db';
import Coupon from '@/models/Coupon';

export const VALID_COUPONS: Record<string, number> = {
  'ODISHA10': 0.1,
  'HERITAGE20': 0.2,
};

/**
 * Calculate total price for a cart based on DB prices
 * Never trust frontend prices (Condition 2)
 */
export async function calculateCartPrice(
  items: CartItem[],
  products: Map<string, IProduct>,
  couponCode?: string
): Promise<PricingBreakdown> {
  let subtotal = 0;

  for (const item of items) {
    const productId = String(item.productId);
    const product = products.get(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    let basePrice = product.price;
    if (item.variantName && product.variants) {
      const variant = product.variants.find((v: any) => v.name === item.variantName);
      if (variant) {
        basePrice = variant.price;
      }
    }

    const effectivePrice = getEffectivePrice(basePrice, product.discount);
    subtotal += effectivePrice * item.quantity;
  }

  subtotal = formatPrice(subtotal);
  
  const normalizedCoupon = couponCode?.trim().toUpperCase();
  let discount = 0;
  if (normalizedCoupon) {
    let couponDiscountRate = 0;
    try {
      await connectDB();
      const dbCoupon = await Coupon.findOne({ code: normalizedCoupon, isActive: true });
      if (dbCoupon) {
        // Verify expiry
        if (!dbCoupon.expiresAt || new Date(dbCoupon.expiresAt) > new Date()) {
          couponDiscountRate = dbCoupon.discountPercentage;
        }
      }
    } catch (dbError) {
      console.error('[PRICING] Failed to fetch coupon from DB:', dbError);
    }

    // Fallback to static coupons if not found/invalid in DB
    if (couponDiscountRate === 0 && VALID_COUPONS[normalizedCoupon]) {
      couponDiscountRate = VALID_COUPONS[normalizedCoupon];
    }

    if (couponDiscountRate > 0) {
      discount = formatPrice(subtotal * couponDiscountRate);
    }
  }

  const deliveryCharge = getDeliveryCharge(subtotal - discount);
  const total = formatPrice(subtotal - discount + deliveryCharge);

  return {
    subtotal,
    deliveryCharge,
    discount,
    total,
    couponApplied: discount > 0 ? couponCode?.toUpperCase() : undefined,
  };
}

/**
 * Validate that product has sufficient stock (Condition 3)
 */
export function validateStock(
  product: IProduct,
  requestedQuantity: number,
  variantName?: string
): { valid: boolean; message?: string } {
  // If variant exists, check variant-level stock
  if (variantName && product.variants) {
    const variant = product.variants.find((v: any) => v.name === variantName);
    if (!variant) {
      return { valid: false, message: `Variant ${variantName} not found for ${product.name}` };
    }
    
    if (variant.stockQuantity < requestedQuantity) {
      return {
        valid: false,
        message: `Insufficient stock for ${product.name} (${variantName}). Only ${variant.stockQuantity} available.`,
      };
    }
    return { valid: true };
  }

  // Fallback to base product stock
  if (!product.inStock) {
    return {
      valid: false,
      message: `${product.name} is currently out of stock`,
    };
  }

  if (product.stockQuantity < requestedQuantity) {
    return {
      valid: false,
      message: `Insufficient stock for ${product.name}. Only ${product.stockQuantity} available.`,
    };
  }

  return { valid: true };
}
