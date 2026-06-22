import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const GLYPH: Record<ToastType, string> = { success: '✓', error: '!', info: '·' };
const BAR: Record<ToastType, string> = {
  success: 'bg-success',
  error: 'bg-danger',
  info: 'bg-accent',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      idRef.current += 1;
      const id = idRef.current;
      setToasts((prev) => [...prev, { ...t, id }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (message, title) => toast({ type: 'success', message, title }),
      error: (message, title) => toast({ type: 'error', message, title }),
      info: (message, title) => toast({ type: 'info', message, title }),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === 'error' ? 'alert' : 'status'}
            aria-live={t.type === 'error' ? 'assertive' : 'polite'}
            className="animate-toast-in pointer-events-auto relative overflow-hidden rounded-sm bg-ink-bg text-paper-on-ink shadow-paper-2"
          >
            <span className={cn('absolute inset-y-0 left-0 w-1', BAR[t.type])} aria-hidden />
            <div className="flex items-start gap-3 py-3 pl-5 pr-4">
              <span
                aria-hidden
                className={cn(
                  'mt-0.5 text-sm font-semibold leading-none',
                  t.type === 'success' && 'text-success',
                  t.type === 'error' && 'text-danger',
                  t.type === 'info' && 'text-accent',
                )}
              >
                {GLYPH[t.type]}
              </span>
              <div className="min-w-0 flex-1">
                {t.title ? (
                  <p className="text-[11px] text-paper-on-ink/70">{t.title}</p>
                ) : null}
                <p className="text-sm leading-snug">{t.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="-mr-1 -mt-1 p-1 text-base leading-none text-paper-on-ink/50 transition-colors hover:text-paper-on-ink"
              >
                ×
              </button>
            </div>
            <span
              aria-hidden
              className={cn('absolute bottom-0 left-0 h-px w-full origin-left', BAR[t.type])}
              style={{ animation: 'toast-progress 4.2s linear forwards' }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
