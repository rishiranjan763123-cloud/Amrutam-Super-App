import { apiConfig } from '../network/apiConfig';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private log(level: LogLevel, message: string, meta?: unknown) {
    if (!apiConfig.isDev && level === 'debug') return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'error':
        console.error(prefix, message, meta ?? '');
        break;
      case 'warn':
        console.warn(prefix, message, meta ?? '');
        break;
      default:
        console.log(prefix, message, meta ?? '');
    }

    // Production: forward errors to crash reporting (Sentry)
    if (level === 'error' && !apiConfig.isDev) {
      // Sentry.captureMessage(message) — wired in initSentry.ts
    }
  }

  debug(message: string, meta?: unknown) { this.log('debug', message, meta); }
  info(message: string, meta?: unknown) { this.log('info', message, meta); }
  warn(message: string, meta?: unknown) { this.log('warn', message, meta); }
  error(message: string, meta?: unknown) { this.log('error', message, meta); }
}

export const logger = new Logger();