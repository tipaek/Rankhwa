import React, { createContext, useCallback, useContext, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/cn';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
  duration?: number; // ms
}

interface ToastInternal extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((existing) => existing.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', duration = 4000 }: ToastOptions) => {
      const id = crypto.randomUUID();
      const next: ToastInternal = { id, title, description, variant, duration };
      setToasts((current) => [...current, next]);
      // Auto remove after duration
      setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'w-80 p-4 rounded-md shadow-lg border-l-4 bg-card border-card text-foreground',
              t.variant === 'success' && 'border-success',
              t.variant === 'error' && 'border-error',
              t.variant === 'info' && 'border-primary'
            )}
            role="status"
            aria-live="polite"
          >
            <div className="flex justify-between items-start">
              <div className="pr-4">
                <p className="font-medium">{t.title}</p>
                {t.description && <p className="text-sm mt-1 text-muted-foreground">{t.description}</p>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(t.id)}
                aria-label="Close"
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}