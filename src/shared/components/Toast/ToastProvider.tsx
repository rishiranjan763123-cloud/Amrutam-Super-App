import React, { useState, useCallback } from 'react';
import { ToastContext, ToastType } from './useToast';
import { Toast } from './Toast';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null);

  const show = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    setToast({ id: `${Date.now()}`, message, type, duration });
  }, []);

  const hide = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} duration={toast.duration} onHide={hide} />
      )}
    </ToastContext.Provider>
  );
}