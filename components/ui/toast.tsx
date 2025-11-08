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

type ToastVariant = 'success' | 'error' | 'info';

export type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  // botão opcional (ex.: “Ver carrinho”)
  action?: { label: string; href?: string; onClick?: () => void };
  duration?: number; // ms
};

type ToastItem = ToastOptions & { id: string };

type ToastContextValue = {
  show: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/** Função global usada pelos componentes: import { toast } from '@/components/ui/toast' */
export function toast(opts: ToastOptions) {
  // Dispara um evento global; o Provider escuta e mostra o toast
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<ToastOptions>('app:toast', { detail: opts }));
  }
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const remove = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (opts: ToastOptions) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = {
        id,
        title: opts.title ?? 'Tudo certo!',
        description: opts.description,
        variant: opts.variant ?? 'info',
        action: opts.action,
        duration: opts.duration ?? 2800,
      };
      setToasts((list) => [...list, item]);
      // auto close
      if (item.duration! > 0) {
        window.setTimeout(() => remove(id), item.duration);
      }
    },
    [remove]
  );

  // escuta evento global disparado por toast(...)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastOptions>).detail;
      show(detail || {});
    };
    window.addEventListener('app:toast', handler as EventListener);
    return () => window.removeEventListener('app:toast', handler as EventListener);
  }, [show]);

  const value = useMemo<ToastContextValue>(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[100] flex items-end justify-center gap-2 p-4 sm:items-end sm:justify-end">
            <div className="flex w-full max-w-sm flex-col gap-2">
              {toasts.map((t) => (
                <ToastCard key={t.id} item={t} onClose={() => remove(t.id)} />
              ))}
            </div>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: () => void;
}) {
  const color =
    item.variant === 'success'
      ? 'bg-emerald-600/15 text-emerald-200 ring-1 ring-emerald-500/30'
      : item.variant === 'error'
      ? 'bg-rose-600/15 text-rose-200 ring-1 ring-rose-500/30'
      : 'bg-zinc-700/40 text-zinc-100 ring-1 ring-zinc-500/30';

  return (
    <div className={`pointer-events-auto rounded-xl px-4 py-3 shadow-2xl backdrop-blur ${color}`}>
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-current opacity-70" />
        <div className="min-w-0 flex-1">
          {item.title && <p className="font-medium leading-tight">{item.title}</p>}
          {item.description && (
            <p className="mt-0.5 text-sm leading-snug opacity-90">{item.description}</p>
          )}
          {item.action && (
            <div className="mt-3">
              {item.action.href ? (
                <a
                  href={item.action.href}
                  className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/5"
                >
                  {item.action.label}
                </a>
              ) : (
                <button
                  onClick={item.action.onClick}
                  className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/5"
                >
                  {item.action.label}
                </button>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10"
          aria-label="Fechar"
        >
          ×
        </button>
      </div>
    </div>
  );
}