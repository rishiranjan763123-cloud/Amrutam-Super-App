import { useInfiniteQuery } from '@tanstack/react-query';
import { shopApi } from '../api/shop.api';
import { ProductSearchParams } from '../api/shop.types';

const PAGE_SIZE = 30;

type ProductFilters = Omit<ProductSearchParams, 'page' | 'pageSize'>;

export function useProductList(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam = 0 }) =>
      shopApi.searchProducts({ ...filters, page: pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    initialPageParam: 0,
  });
}