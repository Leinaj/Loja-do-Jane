'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ========================
// Tipos
// ========================
type ToastVariant = 'success' | 'error' | 'info';

export type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant?: ToastVariant;
  actionLabel?: string;
  actionHref?: string;
  durationMs?: number; // default 2800
};

type ToastContextType = {
  items: ToastItem[];
  push: (t: Omit<ToastItem, 'id'>) => void;
  remove: (id: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

// ========================
// Provider
// ========================
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = nextId.current++;
    const item: ToastItem = {
      id,
      durationMs: 2800,
      variant: 'success',
      ...t,
    };
    setItems((prev) => [...prev, item]);

    // auto-close
    const ms = item.durationMs ?? 2800;
    if (ms > 0) {
      setTimeout(() => remove(id), ms);
    }
  }, [remove]);

  const value = useMemo(() => ({ items, push, remove }), [items, push, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastBridge />
    </ToastContext.Provider>
  );
}

// hook
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>.');
  return ctx;
}

// ========================
// API simples (igual ao que você importava como "toast")
// ========================
export function toast(opts: Omit<ToastItem, 'id'>) {
  // Este módulo expõe uma função globalmente através do bridge.
  if (typeof window !== 'undefined' && (window as any).__toastPush) {
    (window as any).__toastPush(opts);
  }
}

// ========================
// Bridge + Container (com Portal só no cliente)
// ========================
export function ToastBridge() {
  const { items, remove, push } = useToast();

  // expõe a função pro import { toast } funcionar em qualquer arquivo client
  useEffect(() => {
    (window as any).__toastPush = push;
    return () => { (window as any).__toastPush = undefined; };
  }, [push]);

  if (typeof document === 'undefined') return null; // evita SSR

  return createPortal(
    <ToastContainer items={items} onClose={remove} />,
    document.body
  );
}

function ToastContainer({ items, onClose }: { items: ToastItem[]; onClose: (id: number) => void }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex w-full justify-center px-4"
    >
      <div className="flex w-full max-w-md flex-col gap-3">
        {items.map((it) => (
          <div
            key={it.id}
            className={[
              'pointer-events-auto rounded-2xl px-4 py-3 shadow-lg ring-1 ring-black/10',
              it.variant === 'error' && 'bg-red-600 text-white',
              it.variant === 'success' && 'bg-emerald-600 text-white',
              it.variant === 'info' && 'bg-slate-700 text-white',
            ].filter(Boolean).join(' ')}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="font-semibold leading-5">{it.title}</p>
                {it.description ? (
                  <p className="text-sm/5 opacity-90">{it.description}</p>
                ) : null}
                {it.actionHref && it.actionLabel ? (
                  <a
                    href={it.actionHref}
                    className="mt-2 inline-flex text-sm underline underline-offset-2"
                  >
                    {it.actionLabel}
                  </a>
                ) : null}
              </div>
              <button
                onClick={() => onClose(it.id)}
                className="ml-1 rounded-md px-2 text-sm/5 opacity-80 hover:opacity-100"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}