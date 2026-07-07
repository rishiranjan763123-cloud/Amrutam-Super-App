import { useState, useMemo, useCallback } from 'react';
import { ProductSearchParams } from '../api/shop.types';
import { useDebouncedSearch } from '../../../shared/hooks/useDebouncedSearch';

type Filters = Omit<ProductSearchParams, 'page' | 'pageSize' | 'query'>;

export function useProductFilters() {
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(300);
  const [filters, setFilters] = useState<Filters>({});

  const toggleCategory = useCallback((category: string) => {
    setFilters((prev) => {
      const current = prev.categories ?? [];
      const exists = current.includes(category);
      return {
        ...prev,
        categories: exists ? current.filter((c) => c !== category) : [...current, category],
      };
    });
  }, []);

  const setSortBy = useCallback((sortBy: ProductSearchParams['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const setPriceRange = useCallback((minPrice?: number, maxPrice?: number) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
  }, []);

  const toggleInStockOnly = useCallback(() => {
    setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    setQuery('');
  }, [setQuery]);

  const combinedFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery || undefined }),
    [filters, debouncedQuery]
  );

  return {
    query,
    setQuery,
    filters: combinedFilters,
    toggleCategory,
    setSortBy,
    setPriceRange,
    toggleInStockOnly,
    resetFilters,
  };
}