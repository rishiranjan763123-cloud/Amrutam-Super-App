import { useState, useCallback, useMemo } from 'react';
import { RecordType } from '../mocks/generateRecords';
import { useDebouncedSearch } from '../../../shared/hooks/useDebouncedSearch';

export function useRecordFilters() {
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(300);
  const [types, setTypes] = useState<RecordType[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const toggleType = useCallback((type: RecordType) => {
    setTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }, []);

  const resetFilters = useCallback(() => {
    setTypes([]);
    setTags([]);
    setQuery('');
  }, [setQuery]);

  const filters = useMemo(
    () => ({
      query: debouncedQuery || undefined,
      types: types.length ? types : undefined,
      tags: tags.length ? tags : undefined,
    }),
    [debouncedQuery, types, tags]
  );

  return { query, setQuery, types, tags, toggleType, toggleTag, resetFilters, filters };
}