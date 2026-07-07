export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status?: number;
  isNetworkError: boolean;
  isTimeout: boolean;
  isSessionExpired: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
}

export type RequestConfig = {
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
  skipCache?: boolean;
};