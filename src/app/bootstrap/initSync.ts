import { syncManager } from '../../shared/offline/syncManager';
import { mutationQueue } from '../../shared/offline/mutationQueue';
import { logger } from '../../shared/logging/logger';

/**
 * Runs once at app startup — if there are leftover queued mutations
 * from a previous session (e.g. app was killed while offline), attempt
 * to flush them immediately in case connectivity is already available.
 */
export function initSync(): void {
  const pending = mutationQueue.getAll();
  if (pending.length > 0) {
    logger.info(`Found ${pending.length} pending mutations from previous session`);
    syncManager.processSyncQueue();
  }
}