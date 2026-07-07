import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWishlistStore } from '../store/wishlist.store';
import { shopApi } from '../api/shop.api';

export function useWishlist() {
  const productIds = useWishlistStore((s) => s.productIds);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  const { data: wishlistedProducts, isLoading } = useQuery({
    queryKey: ['wishlist-products', productIds],
    queryFn: () => shopApi.getProductsByIds(productIds),
    enabled: productIds.length > 0,
  });

  const toggle = useCallback((productId: string) => toggleWishlist(productId), [toggleWishlist]);

  return {
    productIds,
    wishlistedProducts: wishlistedProducts ?? [],
    isLoading,
    toggle,
    isWishlisted,
    clearWishlist,
  };
}