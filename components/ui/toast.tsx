'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import * as ReactDOM from 'react-dom';

type ToastData = {
  id: number;
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
};

type ToastContextType = {
  push: (t: Omit<ToastData, 'id'>) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastData[]>([]);
  const push = useCallback((t: Omit<ToastData, 'id'>) => {
    setItems((prev) => [...prev, { ...t, id: Date.now() + Math.random() }]);
    setTimeout(() => {
      setItems((prev) => prev.slice(1));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <ToastViewport items={items} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ items }: { items: ToastData[] }) {
  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(
    <div className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-xl space-y-2">
      {items.map((t) => (
        <div
          key={t.id}
          className="rounded-xl bg-neutral-800/90 backdrop-blur px-4 py-3 text-neutral-50 shadow-lg border border-neutral-700"
        >
          {t.title && <div className="font-semibold">{t.title}</div>}
          {t.description && (
            <div className="text-sm text-neutral-200">{t.description}</div>
          )}
          {t.action && (
            <button
              onClick={t.action.onClick}
              className="mt-3 inline-flex items-center rounded-lg border border-neutral-600 px-3 py-1 text-sm hover:bg-neutral-700"
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>,
    document.body
  );
}

/** Hook público */
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
};

/** API simples estilo “toast()” */
export const toast = (msg: {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) => {
  // ponte leve via evento — evita importar o provider em todo lugar
  window.dispatchEvent(new CustomEvent('app:toast', { detail: msg }));
};

/** Ponte opcional (não precisa mexer) */
export function ToastBridge() {
  const { push } = useToast();
  React.useEffect(() => {
    const handler = (e: Event) => {
      // @ts-ignore
      push((e as CustomEvent).detail);
    };
    window.addEventListener('app:toast', handler as any);
    return () => window.removeEventListener('app:toast', handler as any);
  }, [push]);
  return null;
}