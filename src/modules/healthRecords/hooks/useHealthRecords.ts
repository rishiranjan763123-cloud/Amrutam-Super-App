import { useInfiniteQuery } from '@tanstack/react-query';
import { healthRecordsApi } from '../api/healthRecords.api';
import { RecordSearchParams } from '../api/healthRecords.types';

const PAGE_SIZE = 25;

type RecordFilters = Omit<RecordSearchParams, 'page' | 'pageSize'>;

export function useHealthRecords(filters: RecordFilters) {
  return useInfiniteQuery({
    queryKey: ['health-records', filters],
    queryFn: ({ pageParam = 0 }) =>
      healthRecordsApi.searchRecords({ ...filters, page: pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    initialPageParam: 0,
  });
}