'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number; // ms
  variant?: 'success' | 'error' | 'info';
};

type ToastContextValue = {
  show: (t: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

function ToastItem({ t, onClose }: { t: Toast; onClose: (id: string) => void }) {
  useEffect(() => {
    const ms = t.duration ?? 3000;
    const id = setTimeout(() => onClose(t.id), ms);
    return () => clearTimeout(id);
  }, [t, onClose]);

  const color =
    t.variant === 'error'
      ? 'bg-rose-600'
      : t.variant === 'success'
      ? 'bg-emerald-600'
      : 'bg-sky-600';

  return (
    <div
      className={[
        'pointer-events-auto w-full max-w-sm rounded-xl p-4 shadow-2xl ring-1 ring-black/10',
        'backdrop-blur-md bg-neutral-900/90 text-white',
        'animate-[toast-in_180ms_ease-out]',
      ].join(' ')}
      style={{}}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${color}`} />
        <div className="min-w-0 flex-1">
          {t.title && <div className="font-semibold">{t.title}</div>}
          {t.description && (
            <div className="mt-0.5 text-sm text-white/80">{t.description}</div>
          )}
          {t.action && (
            <button
              onClick={t.action.onClick}
              className="mt-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              {t.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onClose(t.id)}
          className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Fechar"
          title="Fechar"
        >
          ✕
        </button>
      </div>
      <style>{`
        @keyframes toast-in {
          from { transform: translateY(8px) scale(.98); opacity: 0 }
          to   { transform: translateY(0)   scale(1);   opacity: 1 }
        }
      `}</style>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    const toast: Toast = { id, ...t };
    setToasts((cur) => [...cur, toast]);
  }, []);

  const close = useCallback((id: string) => {
    setToasts((cur) => cur.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {mounted.current &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[999] flex flex-col items-center gap-3 px-4">
            {toasts.map((t) => (
              <ToastItem key={t.id} t={t} onClose={close} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}