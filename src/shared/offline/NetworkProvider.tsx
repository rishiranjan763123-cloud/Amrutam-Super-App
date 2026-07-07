import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncManager } from './syncManager';
import { logger } from '../logging/logger';

interface NetworkContextValue {
  isConnected: boolean;
  isInternetReachable: boolean;
}

const NetworkContext = createContext<NetworkContextValue>({
  isConnected: true,
  isInternetReachable: true,
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const wasOffline = !isConnected;
      setIsConnected(!!state.isConnected);
      setIsInternetReachable(!!state.isInternetReachable);

      // Reconnected — trigger sync of queued mutations
      if (wasOffline && state.isConnected && state.isInternetReachable) {
        logger.info('Network reconnected — starting sync');
        syncManager.processSyncQueue();
      }
    });

    return () => unsubscribe();
  }, [isConnected]);

  return (
    <NetworkContext.Provider value={{ isConnected, isInternetReachable }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}