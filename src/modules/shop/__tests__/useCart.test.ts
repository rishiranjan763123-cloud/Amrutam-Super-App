import { act, renderHook } from '@testing-library/react-native';
import { useCartStore } from '../store/cart.store';

describe('cart.store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds a new item to the cart', () => {
    act(() => {
      useCartStore.getState().addItem(
        { productId: 'p1', name: 'Test Product', price: 100, discountPercent: 0, imageSeed: 1 },
        1
      );
    });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('increments quantity when adding an existing item', () => {
    const item = { productId: 'p1', name: 'Test Product', price: 100, discountPercent: 0, imageSeed: 1 };
    act(() => {
      useCartStore.getState().addItem(item, 1);
      useCartStore.getState().addItem(item, 2);
    });
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it('removes an item from the cart', () => {
    act(() => {
      useCartStore.getState().addItem({ productId: 'p1', name: 'Test', price: 100, discountPercent: 0, imageSeed: 1 });
      useCartStore.getState().removeItem('p1');
    });
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('decrementing to zero removes the item', () => {
    act(() => {
      useCartStore.getState().addItem({ productId: 'p1', name: 'Test', price: 100, discountPercent: 0, imageSeed: 1 }, 1);
      useCartStore.getState().decrementQuantity('p1');
    });
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clampQuantity keeps quantity within bounds via updateQuantity', () => {
    act(() => {
      useCartStore.getState().addItem({ productId: 'p1', name: 'Test', price: 100, discountPercent: 0, imageSeed: 1 }, 1);
      useCartStore.getState().updateQuantity('p1', 200);
    });
    expect(useCartStore.getState().items[0].quantity).toBe(99);
  });
});