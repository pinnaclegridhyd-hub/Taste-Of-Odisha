/**
 * Generate slug from product name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Generate unique order ID with ODISHA prefix + timestamp-based suffix
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString();
  const randomSuffix = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ODISHA${randomSuffix}${timestamp.slice(-6)}`;
}

/**
 * Format price to 2 decimal places
 */
export function formatPrice(price: number): number {
  return Math.round(price * 100) / 100;
}

/**
 * Calculate effective price with discount
 */
export function getEffectivePrice(
  basePrice: number,
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: Date;
    endDate?: Date;
  }
): number {
  if (!discount) {
    return formatPrice(basePrice);
  }

  // Check if discount is valid (within date range)
  const now = new Date();
  if (discount.startDate && now < discount.startDate) {
    return formatPrice(basePrice);
  }
  if (discount.endDate && now > discount.endDate) {
    return formatPrice(basePrice);
  }

  if (discount.type === 'percentage') {
    const discountAmount = basePrice * (discount.value / 100);
    return formatPrice(basePrice - discountAmount);
  } else {
    // fixed discount
    const discountedPrice = basePrice - discount.value;
    return formatPrice(Math.max(0, discountedPrice));
  }
}

/**
 * Calculate delivery charge
 * Free if total >= 499, else fixed charge (e.g., ₹60)
 */
export function getDeliveryCharge(subtotal: number): number {
  const FREE_DELIVERY_THRESHOLD = 499;
  const DELIVERY_CHARGE = 60;

  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
}
