// components/ui/toast.tsx
'use client';

import React, { useEffect, useState } from 'react';

export type ToastData = {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  durationMs?: number; // padrão 3000
};

type ToastItem = ToastData & { id: string };

const EVENT_NAME = 'app:toast';

export function showToast(data: ToastData) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function handle(e: Event) {
      const custom = e as CustomEvent<ToastData>;
      const id = crypto.randomUUID();
      const duration = custom.detail.durationMs ?? 3000;

      setToasts(prev => [...prev, { id, ...custom.detail }]);

      // remove automático com cleanup correto
      const timer = window.setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);

      // NADA de retornar boolean aqui
      // (o retorno do efeito é outra função – o cleanup deste listener)
      return () => window.clearTimeout(timer);
    }

    window.addEventListener(EVENT_NAME, handle as EventListener);
    return () => {
      window.removeEventListener(EVENT_NAME, handle as EventListener);
    };
  }, []);

  return (
    <>
      {children}
      {/* Container dos toasts (bottom) */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 16,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      >
        <div style={{ width: '100%', maxWidth: 520, padding: '0 12px' }}>
          {toasts.map(t => (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(17, 24, 39, 0.85)', // fundo escuro translúcido
                backdropFilter: 'saturate(150%) blur(4px)',
                color: '#e5e7eb',
                borderRadius: 12,
                padding: 14,
                marginTop: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,.35)',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: t.description ? 4 : 0 }}>
                {t.title}
              </div>
              {t.description && (
                <div style={{ opacity: 0.9, fontSize: 14 }}>{t.description}</div>
              )}
              {t.actionText && t.onAction && (
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={t.onAction}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'transparent',
                      color: '#d1fae5',
                    }}
                  >
                    {t.actionText}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}