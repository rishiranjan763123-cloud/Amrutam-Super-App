import { useMemo, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../store/cart.store';
import { shopApi } from '../api/shop.api';
import { mutationQueue } from '../../../shared/offline/mutationQueue';
import { useNetwork } from '../../../shared/offline/NetworkProvider';
import { useToast } from '../../../shared/components/Toast/useToast';
import {
  getCartSubtotal,
  getCartDiscount,
  getCartTotal,
  getCartItemCount,
} from '../utils/cartMath';

export function useCart() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const incrementQuantity = useCartStore((s) => s.incrementQuantity);
  const decrementQuantity = useCartStore((s) => s.decrementQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const { isConnected } = useNetwork();
  const { show } = useToast();

  // Derived totals — memoized so they don't recompute on unrelated re-renders
  const summary = useMemo(
    () => ({
      subtotal: getCartSubtotal(items),
      discount: getCartDiscount(items),
      total: getCartTotal(items),
      itemCount: getCartItemCount(items),
    }),
    [items]
  );

  const syncMutation = useMutation({
    mutationFn: () =>
      shopApi.syncCart({ items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
  });

  const syncCart = useCallback(() => {
    if (!isConnected) {
      mutationQueue.enqueue({
        type: 'ADD_TO_CART',
        payload: { items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) },
      });
      show('Cart saved offline — will sync when reconnected.', 'info');
      return;
    }
    syncMutation.mutate();
  }, [isConnected, items, syncMutation, show]);

  return {
    items,
    summary,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    syncCart,
  };
}