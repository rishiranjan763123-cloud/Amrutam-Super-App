import {
  getLineItemTotal,
  getCartSubtotal,
  getCartDiscount,
  getCartTotal,
  getCartItemCount,
  clampQuantity,
  CartLineItem,
} from '../utils/cartMath';

const items: CartLineItem[] = [
  { productId: 'p1', price: 100, discountPercent: 10, quantity: 2 },
  { productId: 'p2', price: 50, discountPercent: 0, quantity: 1 },
];

describe('getLineItemTotal', () => {
  it('applies discount correctly', () => {
    expect(getLineItemTotal(items[0])).toBe(180); // 100 * 0.9 * 2
  });

  it('handles zero discount', () => {
    expect(getLineItemTotal(items[1])).toBe(50);
  });
});

describe('getCartSubtotal', () => {
  it('sums prices before discount', () => {
    expect(getCartSubtotal(items)).toBe(250); // (100*2) + (50*1)
  });
});

describe('getCartDiscount', () => {
  it('calculates total discount amount', () => {
    expect(getCartDiscount(items)).toBe(20); // 250 - 230
  });
});

describe('getCartTotal', () => {
  it('calculates final total after discount', () => {
    expect(getCartTotal(items)).toBe(230); // 180 + 50
  });
});

describe('getCartItemCount', () => {
  it('sums quantities across items', () => {
    expect(getCartItemCount(items)).toBe(3);
  });
});

describe('clampQuantity', () => {
  it('clamps below 1 to 1', () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(-5)).toBe(1);
  });

  it('clamps above 99 to 99', () => {
    expect(clampQuantity(150)).toBe(99);
  });

  it('floors decimal values', () => {
    expect(clampQuantity(5.7)).toBe(5);
  });

  it('leaves valid values unchanged', () => {
    expect(clampQuantity(10)).toBe(10);
  });
});