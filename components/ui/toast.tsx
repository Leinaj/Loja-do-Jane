'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

/* ------------------------------------------------------------------ */
/* 🔧 Fallback de tipagem para react-dom (evita precisar instalar @types/react-dom)
   Isso é seguro e resolve o erro "Could not find a declaration file..."  */
/* ------------------------------------------------------------------ */
declare module 'react-dom' {
  import * as React from 'react';
  export function createPortal(
    children: React.ReactNode,
    container: Element | DocumentFragment
  ): React.ReactPortal;
}
import { createPortal } from 'react-dom';

/* ------------------------------------------------------------------ */
/* Tipos e utilidades                                                  */
/* ------------------------------------------------------------------ */
type ToastVariant = 'success' | 'error' | 'info';
export type ToastItem = {
  id: number;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastContextValue = {
  notify: (toast: Omit<ToastItem, 'id'>) => void;
  remove: (id: number) => void;
  items: ToastItem[];
};

const ToastContext = createContext<ToastContextValue | null>(null);

const useIsClient = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
};

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [seq, setSeq] = useState(1);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      setSeq((s) => s + 1);
      const id = seq;
      const withDefaults: ToastItem = {
        id,
        title: toast.title ?? 'Tudo certo!',
        description: toast.description ?? '',
        variant: toast.variant ?? 'info',
        durationMs: toast.durationMs ?? 2800,
        actionHref: toast.actionHref,
        actionLabel: toast.actionLabel,
      };
      setItems((prev) => [...prev, withDefaults]);

      // auto-close
      const ms = withDefaults.durationMs!;
      if (ms > 0) {
        setTimeout(() => remove(id), ms);
      }
    },
    [remove, seq]
  );

  const value = useMemo<ToastContextValue>(
    () => ({ notify, remove, items }),
    [notify, remove, items]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Mantemos o container aqui para sempre existir no app */}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider />');
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Container (renderiza via Portal no <body>)                          */
/* ------------------------------------------------------------------ */
export function ToastContainer() {
  const isClient = useIsClient();
  const ctx = useContext(ToastContext);

  if (!ctx) return null;
  const { items, remove } = ctx;

  if (!isClient || typeof document === 'undefined') return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[1000] flex w-full justify-center">
      <ul className="flex w-full max-w-md flex-col gap-2 px-3">
        {items.map((t) => (
          <li
            key={t.id}
            className={[
              'pointer-events-auto rounded-lg border px-4 py-3 shadow-md backdrop-blur',
              t.variant === 'success' && 'border-emerald-600/30 bg-emerald-900/50',
              t.variant === 'error' && 'border-rose-600/30 bg-rose-900/50',
              t.variant === 'info' && 'border-white/15 bg-black/60',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                {t.title && <p className="font-medium leading-tight">{t.title}</p>}
                {t.description && (
                  <p className="text-sm text-white/80">{t.description}</p>
                )}
                {t.actionHref && t.actionLabel && (
                  <a
                    href={t.actionHref}
                    className="mt-2 inline-block rounded-md bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
                  >
                    {t.actionLabel}
                  </a>
                )}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="rounded-md px-2 py-1 text-sm text-white/70 hover:bg-white/10"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/* Exemplo de uso:
   const { notify } = useToast();
   notify({ title: 'Produto adicionado!', description: '...' })
/* ------------------------------------------------------------------ */