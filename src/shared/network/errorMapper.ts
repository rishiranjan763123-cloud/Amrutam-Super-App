import { ApiError } from '../types/api';

export function mapToApiError(error: any): ApiError {
  // Network unreachable
  if (!error.response && error.message === 'Network Error') {
    return {
      code: 'NETWORK_ERROR',
      message: 'No internet connection. Please check your network.',
      isNetworkError: true,
      isTimeout: false,
      isSessionExpired: false,
    };
  }

  // Timeout
  if (error.code === 'ECONNABORTED') {
    return {
      code: 'TIMEOUT',
      message: 'Request timed out. Please try again.',
      isNetworkError: false,
      isTimeout: true,
      isSessionExpired: false,
    };
  }

  const status = error.response?.status;

  // Session expired
  if (status === 401) {
    return {
      code: 'SESSION_EXPIRED',
      message: 'Your session has expired. Please log in again.',
      status,
      isNetworkError: false,
      isTimeout: false,
      isSessionExpired: true,
    };
  }

  // Invalid/malformed JSON from server
  if (error instanceof SyntaxError) {
    return {
      code: 'INVALID_RESPONSE',
      message: 'Received an invalid response from the server.',
      isNetworkError: false,
      isTimeout: false,
      isSessionExpired: false,
    };
  }

  return {
    code: error.response?.data?.code || 'UNKNOWN_ERROR',
    message: error.response?.data?.message || 'Something went wrong. Please try again.',
    status,
    isNetworkError: false,
    isTimeout: false,
    isSessionExpired: false,
  };
}