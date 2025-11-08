'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

type ToastAction = { label: string; href: string };
type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
  actionPrimary?: ToastAction;
  actionSecondary?: ToastAction;
  durationMs?: number;
};

type ToastContextValue = {
  show: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const show = useCallback((opts: ToastOptions) => {
    const id = opts.id ?? Math.random().toString(36).slice(2);
    const duration = opts.durationMs ?? 4200;

    setToasts((t) => [...t, { ...opts, id }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, duration);
    }
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[999] mx-auto w-full max-w-lg px-3">
          <div className="space-y-3">
            {toasts.map((t) => (
              <ToastItem
                key={t.id}
                {...t}
                onClose={() =>
                  setToasts((list) => list.filter((x) => x.id !== t.id))
                }
              />
            ))}
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({
  title,
  description,
  variant = 'info',
  actionPrimary,
  actionSecondary,
  onClose,
}: ToastOptions & { onClose: () => void }) {
  const tone =
    variant === 'success'
      ? 'bg-emerald-600/20 text-emerald-100 border-emerald-500/30'
      : variant === 'error'
      ? 'bg-rose-600/20 text-rose-100 border-rose-500/30'
      : 'bg-white/10 text-white border-white/20';

  return (
    <div
      className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-xl backdrop-blur ${tone}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-400"></span>
        <div className="flex-1">
          {title && (
            <div className="text-base font-semibold leading-tight">{title}</div>
          )}
          {description && (
            <div className="mt-1 text-sm/relaxed opacity-90">{description}</div>
          )}

          {(actionPrimary || actionSecondary) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actionPrimary && (
                <Link
                  href={actionPrimary.href}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  {actionPrimary.label}
                </Link>
              )}
              {actionSecondary && (
                <Link
                  href={actionSecondary.href}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-emerald-200 hover:bg-white/15"
                >
                  {actionSecondary.label}
                </Link>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="rounded-md p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Fechar"
          type="button"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// Helper para chamar rápido
export function toast(opts: ToastOptions) {
  // @ts-expect-error – guardamos no window para facilitar acesso fora de hooks
  if (typeof window !== 'undefined' && window.__appToastShow) {
    // @ts-expect-error
    window.__appToastShow(opts);
  }
}

// registra o helper global quando o provider monta
export function ToastBridge() {
  const { show } = useToast();

  useEffect(() => {
    // @ts-expect-error
    window.__appToastShow = show;
    return () => {
      // @ts-expect-error
      window.__appToastShow = undefined;
    };
  }, [show]);

  return null;
}