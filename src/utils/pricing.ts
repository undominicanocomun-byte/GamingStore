/**
 * Pure calculation logic for Nexus Gaming e-commerce platform
 */

export interface CartItemLike {
  price: number;
  quantity: number;
}

export interface CouponRule {
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  active: boolean;
  expiresAt?: string;
}

export interface PCComponent {
  id: string;
  category: 'cpu' | 'motherboard' | 'ram' | 'gpu' | 'storage' | 'psu' | 'case' | 'cooler';
  name: string;
  price: number;
  watts?: number;
  socket?: string; // e.g., 'AM5', 'LGA1700', 'LGA1851'
  formFactor?: string; // 'ATX', 'Micro-ATX', 'Mini-ITX'
}

export interface PCBuildState {
  cpu?: PCComponent;
  motherboard?: PCComponent;
  ram?: PCComponent;
  gpu?: PCComponent;
  storage?: PCComponent;
  psu?: PCComponent;
  case?: PCComponent;
  cooler?: PCComponent;
}

/**
 * Calculates cart subtotal
 */
export function calculateSubtotal(items: CartItemLike[]): number {
  if (!items || items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + (item.price * Math.max(1, item.quantity)), 0);
  return Math.round(total * 100) / 100;
}

/**
 * Applies a coupon to a subtotal
 */
export function calculateDiscount(subtotal: number, coupon?: CouponRule | null): { discount: number; isValid: boolean; reason?: string } {
  if (!coupon) return { discount: 0, isValid: false };
  if (!coupon.active) return { discount: 0, isValid: false, reason: 'El cupón no está activo' };
  
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { discount: 0, isValid: false, reason: 'El cupón ha expirado' };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return { 
      discount: 0, 
      isValid: false, 
      reason: `Requiere una compra mínima de $${coupon.minOrderAmount}` 
    };
  }

  let discount = 0;
  if (coupon.discountPercentage) {
    discount = (subtotal * coupon.discountPercentage) / 100;
  } else if (coupon.discountAmount) {
    discount = Math.min(subtotal, coupon.discountAmount);
  }

  return {
    discount: Math.round(discount * 100) / 100,
    isValid: true
  };
}

/**
 * Calculates shipping fee (free shipping for orders over $150)
 */
export function calculateShipping(subtotalAfterDiscount: number): number {
  if (subtotalAfterDiscount <= 0) return 0;
  if (subtotalAfterDiscount >= 150) return 0; // Free shipping threshold
  return 15.00; // Flat express shipping
}

/**
 * Calculates standard VAT/tax (e.g., 16%)
 */
export function calculateTax(taxableAmount: number, taxRate: number = 0.16): number {
  if (taxableAmount <= 0) return 0;
  return Math.round(taxableAmount * taxRate * 100) / 100;
}

/**
 * Calculates final total
 */
export function calculateOrderTotals(items: CartItemLike[], coupon?: CouponRule | null, taxRate = 0.16) {
  const subtotal = calculateSubtotal(items);
  const { discount, isValid, reason } = calculateDiscount(subtotal, coupon);
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = calculateShipping(discountedSubtotal);
  const tax = calculateTax(discountedSubtotal, taxRate);
  const total = Math.round((discountedSubtotal + shipping + tax) * 100) / 100;

  return {
    subtotal,
    discount,
    discountValid: isValid,
    discountReason: reason,
    shipping,
    tax,
    total
  };
}

/**
 * Validates PC compatibility in the builder
 */
export function validatePCCompatibility(build: PCBuildState): {
  isCompatible: boolean;
  totalWatts: number;
  recommendedPsuWatts: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  let baseWatts = 75; // Motherboard, fans, SSD base overhead

  if (build.cpu?.watts) baseWatts += build.cpu.watts;
  if (build.gpu?.watts) baseWatts += build.gpu.watts;
  if (build.cooler?.watts) baseWatts += build.cooler.watts;

  // Recommended PSU adds a 30% safety headroom
  const recommendedPsuWatts = Math.ceil((baseWatts * 1.3) / 50) * 50;

  // Socket validation
  if (build.cpu && build.motherboard) {
    if (build.cpu.socket && build.motherboard.socket && build.cpu.socket !== build.motherboard.socket) {
      warnings.push(`Incompatibilidad de Socket: La CPU requiere socket ${build.cpu.socket}, pero la placa madre tiene socket ${build.motherboard.socket}.`);
    }
  }

  // PSU capacity check
  if (build.psu && build.psu.watts) {
    if (build.psu.watts < baseWatts) {
      warnings.push(`Fuente insuficiente: El sistema consume ~${baseWatts}W, pero la fuente seleccionada solo entrega ${build.psu.watts}W.`);
    } else if (build.psu.watts < recommendedPsuWatts) {
      warnings.push(`Advertencia de fuente: Se recomienda al menos ${recommendedPsuWatts}W para estabilidad en picos de consumo.`);
    }
  }

  return {
    isCompatible: warnings.length === 0,
    totalWatts: baseWatts,
    recommendedPsuWatts,
    warnings
  };
}

/**
 * Calculates savings between regular and promotional price
 */
export function calculateSavings(price: number, originalPrice?: number): {
  hasDiscount: boolean;
  amountSaved: number;
  percentSaved: number;
} {
  if (!originalPrice || originalPrice <= price) {
    return { hasDiscount: false, amountSaved: 0, percentSaved: 0 };
  }
  const amountSaved = Math.round((originalPrice - price) * 100) / 100;
  const percentSaved = Math.round((amountSaved / originalPrice) * 100);
  return {
    hasDiscount: true,
    amountSaved,
    percentSaved
  };
}

/**
 * Calculates bundle discounted pricing for gaming hardware combos
 */
export function calculateBundleDiscount(
  itemPrices: number[],
  bundleDiscountPercentage: number = 20
): {
  originalTotal: number;
  bundlePrice: number;
  totalSavings: number;
  discountPercentage: number;
} {
  const originalTotal = Math.round(itemPrices.reduce((sum, p) => sum + p, 0) * 100) / 100;
  const discountAmount = Math.round((originalTotal * (bundleDiscountPercentage / 100)) * 100) / 100;
  const bundlePrice = Math.round((originalTotal - discountAmount) * 100) / 100;
  return {
    originalTotal,
    bundlePrice,
    totalSavings: discountAmount,
    discountPercentage: bundleDiscountPercentage
  };
}

