import { QueryClient } from '@tanstack/react-query';
import { shouldRetry, getRetryDelay } from './retryPolicy';
import { logger } from '../logging/logger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: getRetryDelay,
      staleTime: 5 * 60 * 1000, // 5 min — treat cached data as fresh
      gcTime: 24 * 60 * 60 * 1000, // 24 hr — keep in cache for offline access
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        logger.error('Mutation failed', error);
      },
    },
  },
});