'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// ✅ Evita erro de tipos do react-dom no build do Vercel
//    (apenas nesta linha; o resto do arquivo continua tipado normalmente)
// @ts-ignore
import { createPortal } from 'react-dom';
import Link from 'next/link';

type ToastAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
  action?: ToastAction;
  duration?: number; // ms
};

type ToastContextValue = {
  toasts: Toast[];
  show: (t: Omit<Toast, 'id'>) => void;
  hide: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hide = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const toast: Toast = {
        id,
        title: t.title,
        description: t.description,
        variant: t.variant ?? 'info',
        action: t.action,
        duration: t.duration ?? 2800,
      };
      setToasts((curr) => [...curr, toast]);

      if (toast.duration && toast.duration > 0) {
        // fecha automático
        setTimeout(() => hide(id), toast.duration);
      }
    },
    [hide]
  );

  const value = useMemo(() => ({ toasts, show, hide }), [toasts, show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={hide} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onClose,
}: {
  toasts: Toast[];
  onClose: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const root =
    typeof document !== 'undefined'
      ? document.body
      : (null as unknown as Element);

  return createPortal(
    <div className="fixed inset-x-0 bottom-4 z-[60] flex w-full justify-center px-3 sm:px-4">
      <div className="flex w-full max-w-xl flex-col gap-3">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => onClose(t.id)} />
        ))}
      </div>
    </div>,
    root
  );
}

function variantClasses(v?: Toast['variant']) {
  switch (v) {
    case 'success':
      return 'bg-emerald-900/80 ring-1 ring-emerald-700/60';
    case 'error':
      return 'bg-rose-900/80 ring-1 ring-rose-700/60';
    default:
      return 'bg-zinc-900/80 ring-1 ring-zinc-700/60';
  }
}

function dotColor(v?: Toast['variant']) {
  switch (v) {
    case 'success':
      return 'bg-emerald-400';
    case 'error':
      return 'bg-rose-400';
    default:
      return 'bg-emerald-400';
  }
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  return (
    <div
      className={`relative rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-sm ${variantClasses(
        toast.variant
      )}`}
    >
      <button
        onClick={onClose}
        aria-label="Fechar notificação"
        className="absolute right-3 top-3 rounded-full p-1 text-zinc-300/80 transition hover:bg-white/10 hover:text-white"
      >
        {/* Ícone X */}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-3">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${dotColor(toast.variant)}`} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-white">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-zinc-300">
              {toast.description}
            </p>
          )}

          {toast.action && (
            <div className="mt-3">
              {toast.action.href ? (
                <Link
                  href={toast.action.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  {toast.action.label}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ) : (
                <button
                  onClick={toast.action.onClick}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}