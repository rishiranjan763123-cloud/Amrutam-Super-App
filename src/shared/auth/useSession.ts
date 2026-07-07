import { mmkvStorage } from '../storage/mmkv';
import { secureStorage } from './secureStorage';

const SESSION_KEY = 'auth_session';
const TOKEN_KEY = 'auth_token';

interface Session {
  userId: string;
  name: string;
  expiresAt: number;
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const token = await secureStorage.getItem(TOKEN_KEY);
    return token;
  } catch {
    return null;
  }
}

export async function setAuthToken(token: string): Promise<void> {
  await secureStorage.setItem(TOKEN_KEY, token);
}

export async function clearSession(): Promise<void> {
  await secureStorage.removeItem(TOKEN_KEY);
  mmkvStorage.delete(SESSION_KEY);
}

export function getSession(): Session | null {
  return mmkvStorage.getObject<Session>(SESSION_KEY);
}

export function setSession(session: Session): void {
  mmkvStorage.setObject(SESSION_KEY, session);
}

export function isSessionExpired(): boolean {
  const session = getSession();
  if (!session) return true;
  return Date.now() > session.expiresAt;
}

export function useSession() {
  const session = getSession();
  return {
    session,
    isAuthenticated: !!session && !isSessionExpired(),
    isExpired: isSessionExpired(),
  };
}