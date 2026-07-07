import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSession, setSession, clearSession, isSessionExpired } from './useSession';
import { httpClient } from '../network/httpClient';
import { logger } from '../logging/logger';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  login: (userId: string, name: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session && !isSessionExpired()) {
      setIsAuthenticated(true);
      setUserId(session.userId);
    }
    setIsLoading(false);

    httpClient.registerSessionExpiredHandler(() => {
      logger.warn('Session expired — logging out');
      setIsAuthenticated(false);
      setUserId(null);
    });
  }, []);

  const login = useCallback(async (id: string, name: string, token: string) => {
    const { setAuthToken } = await import('./useSession');
    await setAuthToken(token);
    setSession({ userId: id, name, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
    setIsAuthenticated(true);
    setUserId(id);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setIsAuthenticated(false);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}