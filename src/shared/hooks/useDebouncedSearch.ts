import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export function useDebouncedSearch(delayMs: number = 300) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delayMs);

  return useMemo(
    () => ({ query, setQuery, debouncedQuery }),
    [query, debouncedQuery]
  );
}