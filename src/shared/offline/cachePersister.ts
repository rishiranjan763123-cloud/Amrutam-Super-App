import { Persister } from '@tanstack/react-query-persist-client';
import { mmkvStorage } from '../storage/mmkv';

const CACHE_KEY = 'react-query-cache';

export const mmkvPersister: Persister = {
  persistClient: async (client) => {
    mmkvStorage.setObject(CACHE_KEY, client);
  },
  restoreClient: async () => {
    return mmkvStorage.getObject(CACHE_KEY) ?? undefined;
  },
  removeClient: async () => {
    mmkvStorage.delete(CACHE_KEY);
  },
};