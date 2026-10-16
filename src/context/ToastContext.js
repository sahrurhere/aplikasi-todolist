import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error('useToast harus dipakai di dalam <ToastProvider>');
  }
  return showToast;
}