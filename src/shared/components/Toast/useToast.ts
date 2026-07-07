import { useContext, createContext } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextValue {
  show: (message: string, type?: ToastType, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}