'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type ToastData = {
  id: number;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastCtx = {
  push: (t: Omit<ToastData, 'id'>) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<ToastData[]>([]);

  const push: ToastCtx['push'] = (t) =>
    setList((prev) => [...prev, { id: Date.now(), ...t }]);

  const remove = (id: number) =>
    setList((prev) => prev.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {/* BRIDGE */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
        {list.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full max-w-xl rounded-2xl bg-emerald-700/90 text-white shadow-xl backdrop-blur-md"
          >
            <div className="flex items-start gap-3 p-4">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white/90" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{t.title}</p>
                {t.description && (
                  <p className="truncate text-sm opacity-90">{t.description}</p>
                )}

                <div className="mt-3 flex gap-2">
                  {t.actionLabel && t.onAction && (
                    <button
                      onClick={() => {
                        t.onAction?.();
                        remove(t.id);
                      }}
                      className="rounded-xl border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
                    >
                      {t.actionLabel}
                    </button>
                  )}
                </div>
              </div>

              <button
                aria-label="Fechar"
                onClick={() => remove(t.id)}
                className="rounded-md p-1 hover:bg-white/10"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// helper simpático
export const toast = {
  success: (
    title: string,
    opts?: { description?: string; actionLabel?: string; onAction?: () => void }
  ) => {
    (window as any).__toastPush?.({
      title,
      description: opts?.description,
      actionLabel: opts?.actionLabel,
      onAction: opts?.onAction,
    });
  },
};

// Bridge para poder chamar toast.success fora de componentes
export function ToastBridge() {
  const { push } = useToast();
  useEffect(() => {
    (window as any).__toastPush = push;
    return () => {
      (window as any).__toastPush = undefined;
    };
  }, [push]);
  return null;
}