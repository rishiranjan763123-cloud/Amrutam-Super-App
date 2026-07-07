import { mmkvStorage } from '../storage/mmkv';

const QUEUE_KEY = 'offline_mutation_queue';

export type QueuedMutation = {
  id: string;
  type: 'BOOK_CONSULTATION' | 'CANCEL_CONSULTATION' | 'ADD_TO_CART' | 'CHECKOUT';
  payload: unknown;
  createdAt: number;
  retryCount: number;
};

export const mutationQueue = {
  getAll(): QueuedMutation[] {
    return mmkvStorage.getObject<QueuedMutation[]>(QUEUE_KEY) ?? [];
  },

  enqueue(mutation: Omit<QueuedMutation, 'id' | 'createdAt' | 'retryCount'>): void {
    const queue = mutationQueue.getAll();
    const newMutation: QueuedMutation = {
      ...mutation,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: Date.now(),
      retryCount: 0,
    };
    mmkvStorage.setObject(QUEUE_KEY, [...queue, newMutation]);
  },

  remove(id: string): void {
    const queue = mutationQueue.getAll().filter((m) => m.id !== id);
    mmkvStorage.setObject(QUEUE_KEY, queue);
  },

  incrementRetry(id: string): void {
    const queue = mutationQueue.getAll().map((m) =>
      m.id === id ? { ...m, retryCount: m.retryCount + 1 } : m
    );
    mmkvStorage.setObject(QUEUE_KEY, queue);
  },

  clear(): void {
    mmkvStorage.delete(QUEUE_KEY);
  },
};