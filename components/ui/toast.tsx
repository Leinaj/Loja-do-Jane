'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastData = {
  id: number;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

let idSeq = 1;
const listeners = new Set<(t: ToastData) => void>();

function emitToast(t: Omit<ToastData, 'id'>) {
  const data: ToastData = { ...t, id: idSeq++ };
  listeners.forEach((l) => l(data));
}

export const toast = {
  success(opts: { title: string; description?: string; actionLabel?: string; onAction?: () => void }) {
    emitToast({
      title: opts.title,
      description: opts.description,
      actionLabel: opts.actionLabel,
      onAction: opts.onAction,
    });
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handle = (t: ToastData) => {
      setToasts((prev) => [...prev, t]);
      // Auto close
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3500);
    };
    listeners.add(handle);
    return () => listeners.delete(handle);
  }, []);

  const ui = (
    <>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] mb-4 grid place-items-center px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full max-w-xl rounded-2xl border border-white/10 bg-emerald-600/90 text-white shadow-2xl backdrop-blur-sm"
          >
            <div className="flex items-start gap-4 px-5 py-4">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" />
              <div className="flex-1">
                <p className="text-base font-semibold leading-5">{t.title}</p>
                {t.description ? (
                  <p className="mt-1 text-sm text-white/90">{t.description}</p>
                ) : null}
                {t.actionLabel ? (
                  <button
                    onClick={() => t.onAction?.()}
                    className="mt-3 inline-flex items-center rounded-xl border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    {t.actionLabel}
                  </button>
                ) : null}
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="rounded-xl px-2 py-1 text-white/80 hover:bg-white/10"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (!mounted) return <>{children}</>;
  const target = document.body;
  return createPortal(ui, target);
}