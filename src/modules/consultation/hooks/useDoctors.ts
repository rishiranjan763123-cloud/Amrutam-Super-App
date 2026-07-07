import { useInfiniteQuery } from '@tanstack/react-query';
import { consultationApi } from '../api/consultation.api';
import { DoctorSearchParams } from '../api/consultation.types';

const PAGE_SIZE = 20;

type DoctorFilters = Omit<DoctorSearchParams, 'page' | 'pageSize'>;

export function useDoctors(filters: DoctorFilters) {
  return useInfiniteQuery({
    queryKey: ['doctors', filters],
    queryFn: ({ pageParam = 0 }) =>
      consultationApi.searchDoctors({ ...filters, page: pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
    initialPageParam: 0,
  });
}