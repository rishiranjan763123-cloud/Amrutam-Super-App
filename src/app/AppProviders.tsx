import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from '../shared/network/queryClient';
import { mmkvPersister } from '../shared/offline/cachePersister';
import { ThemeProvider } from '../shared/design-system/theme/ThemeProvider';
import { AuthProvider } from '../shared/auth/AuthProvider';
import { NetworkProvider } from '../shared/offline/NetworkProvider';
import { ToastProvider } from '../shared/components/Toast/ToastProvider';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { OfflineBanner } from '../shared/components/OfflineBanner';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NetworkProvider>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{ persister: mmkvPersister, maxAge: 24 * 60 * 60 * 1000 }}
            >
              <ToastProvider>
                <OfflineBanner />
                {children}
              </ToastProvider>
            </PersistQueryClientProvider>
          </NetworkProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}