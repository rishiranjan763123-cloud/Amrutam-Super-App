export function shouldRetry(failureCount: number, error: any): boolean {
  const status = error?.status;

  // Never retry client errors (bad request, validation, not found)
  if (status && status >= 400 && status < 500 && status !== 408) {
    return false;
  }

  // Retry network errors, timeouts, and 5xx up to 2 times
  return failureCount < 2;
}

export function getRetryDelay(attemptIndex: number): number {
  // Exponential backoff: 1s, 2s, 4s (capped at 8s)
  return Math.min(1000 * 2 ** attemptIndex, 8000);
}