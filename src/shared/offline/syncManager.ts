import { mutationQueue, QueuedMutation } from './mutationQueue';
import { httpClient } from '../network/httpClient';
import { logger } from '../logging/logger';

const MAX_RETRIES = 3;

async function executeMutation(mutation: QueuedMutation): Promise<boolean> {
  try {
    switch (mutation.type) {
      case 'BOOK_CONSULTATION':
        await httpClient.post('/consultations/book', mutation.payload);
        return true;
      case 'CANCEL_CONSULTATION':
        await httpClient.post('/consultations/cancel', mutation.payload);
        return true;
      case 'ADD_TO_CART':
        await httpClient.post('/cart/sync', mutation.payload);
        return true;
      case 'CHECKOUT':
        await httpClient.post('/orders/checkout', mutation.payload);
        return true;
      default:
        return false;
    }
  } catch (error) {
    logger.warn(`Sync failed for mutation ${mutation.id}`, error);
    return false;
  }
}

export const syncManager = {
  isSyncing: false,

  async processSyncQueue(): Promise<void> {
    if (syncManager.isSyncing) return;
    syncManager.isSyncing = true;

    const queue = mutationQueue.getAll();
    logger.info(`Processing ${queue.length} queued mutations`);

    for (const mutation of queue) {
      if (mutation.retryCount >= MAX_RETRIES) {
        logger.error(`Dropping mutation ${mutation.id} after max retries`);
        mutationQueue.remove(mutation.id);
        continue;
      }

      const success = await executeMutation(mutation);
      if (success) {
        mutationQueue.remove(mutation.id);
      } else {
        mutationQueue.incrementRetry(mutation.id);
      }
    }

    syncManager.isSyncing = false;
  },
};