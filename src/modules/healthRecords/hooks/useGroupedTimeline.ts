import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { healthRecordsApi } from '../api/healthRecords.api';
import { filterRecords, RecordFilters } from '../utils/recordSearch';
import { groupByMonthYear, flattenTimelineSections } from '../utils/groupByMonthYear';

/**
 * Fetches the full record set once (cached by react-query) and does
 * client-side filter + group + flatten in a single memoized pass.
 * This trades one larger initial fetch for instant, snappy filtering
 * afterwards — appropriate since 10k records of this shape is small
 * JSON payload-wise, and re-fetching per filter change would feel laggy.
 */
export function useGroupedTimeline(filters: RecordFilters) {
  const { data: allRecords, isLoading, error, refetch } = useQuery({
    queryKey: ['all-health-records'],
    queryFn: () => healthRecordsApi.getAllRecords(),
    staleTime: 10 * 60 * 1000,
  });

  const flattenedItems = useMemo(() => {
    if (!allRecords) return [];
    const filtered = filterRecords(allRecords, filters);
    const grouped = groupByMonthYear(filtered);
    return flattenTimelineSections(grouped);
  }, [allRecords, filters]);

  return { flattenedItems, isLoading, error, refetch, totalCount: allRecords?.length ?? 0 };
}