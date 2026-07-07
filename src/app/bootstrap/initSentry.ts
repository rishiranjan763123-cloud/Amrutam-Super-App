import { apiConfig } from '../../shared/network/apiConfig';
import { logger } from '../../shared/logging/logger';

/**
 * Crash reporting abstraction. Kept behind this thin wrapper so the
 * concrete provider (Sentry here) can be swapped without touching
 * call sites elsewhere in the app.
 */
export function initSentry(): void {
  if (apiConfig.isDev) {
    logger.debug('Sentry init skipped in development');
    return;
  }

  try {
    // Sentry.init({ dsn: 'YOUR_DSN', environment: apiConfig.env, tracesSampleRate: 0.2 });
    logger.info('Crash reporting initialized');
  } catch (error) {
    logger.error('Failed to initialize crash reporting', error);
  }
}

export function captureException(error: Error, context?: Record<string, unknown>): void {
  logger.error('Exception captured', { message: error.message, context });
  // Sentry.captureException(error, { extra: context });
}