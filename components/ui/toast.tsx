'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  durationMs?: number; // default 2800
  // Mantemos simples p/ evitar erros de tipagem no build
};

type ToastContextType = {
  show: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const show = (opts: ToastOptions) => {
    const id = opts.id ?? crypto.randomUUID();
    const duration = opts.durationMs ?? 2800;

    setToasts((t) => [...t, { ...opts, id }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  };

  const value = useMemo(() => ({ show }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex w-full justify-center px-4">
          <div className="flex w-full max-w-xl flex-col gap-3">
            {toasts.map((t) => (
              <div
                key={t.id}
                className="pointer-events-auto rounded-2xl border border-emerald-400/30 bg-emerald-500/20 backdrop-blur-md p-4 shadow-lg"
              >
                {t.title && (
                  <div className="mb-0.5 text-emerald-300 font-semibold">
                    {t.title}
                  </div>
                )}
                {t.description && (
                  <div className="text-white/90">{t.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

// Hook e função utilitária
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function toast(opts: ToastOptions) {
  // Fallback para chamadas fora da árvore (SSR não chama)
  if (typeof window === 'undefined') return;
  const ev = new CustomEvent<ToastOptions>('__app_toast__', { detail: opts });
  window.dispatchEvent(ev);
}

// Listener para `toast()` fora do hook (ex.: em actions)
if (typeof window !== 'undefined') {
  let cachedCtx: ToastContextType | null = null;

  // Bridge: injeta a função show do provider no window
  (window as any).__setToastShow = (fn: (o: ToastOptions) => void) => {
    cachedCtx = { show: fn };
  };

  window.addEventListener('__app_toast__', (e: Event) => {
    const detail = (e as CustomEvent<ToastOptions>).detail;
    cachedCtx?.show(detail);
  });
}

// Efeito para conectar o bridge no provider
export function ToastBridge() {
  const { show } = useToast();
  useEffect(() => {
    (window as any).__setToastShow?.(show);
  }, [show]);
  return null;
}