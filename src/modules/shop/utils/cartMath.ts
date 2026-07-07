export interface CartLineItem {
  productId: string;
  price: number;
  discountPercent: number;
  quantity: number;
}

export function getLineItemTotal(item: CartLineItem): number {
  const discounted = item.price * (1 - item.discountPercent / 100);
  return Math.round(discounted * item.quantity * 100) / 100;
}

export function getCartSubtotal(items: CartLineItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
}

export function getCartDiscount(items: CartLineItem[]): number {
  const subtotal = getCartSubtotal(items);
  const totalAfterDiscount = items.reduce((sum, item) => sum + getLineItemTotal(item), 0);
  return Math.round((subtotal - totalAfterDiscount) * 100) / 100;
}

export function getCartTotal(items: CartLineItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + getLineItemTotal(item), 0) * 100) / 100;
}

export function getCartItemCount(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Clamps a quantity update to a safe range (1-99).
 * Prevents accidental zero/negative quantities from UI stepper spam.
 */
export function clampQuantity(quantity: number): number {
  return Math.max(1, Math.min(99, Math.floor(quantity)));
}