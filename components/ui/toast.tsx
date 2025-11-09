'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';

type Toast = { id: number; message: string; };

export default function ToastBridge() {
  const { lastAdded } = useCart(); // exposto pelo provider
  const [toasts, setToasts] = useState<Toast[]>([]);

  // adiciona toast quando item é incluído
  useEffect(() => {
    if (!lastAdded) return;
    const t: Toast = {
      id: Date.now(),
      message: `1 × ${lastAdded.name} foi adicionado ao carrinho.`,
    };
    setToasts((p) => [...p, t]);
    const timer = setTimeout(() => setToasts((p) => p.filter(x => x.id !== t.id)), 3500);
    return () => clearTimeout(timer);
  }, [lastAdded]);

  if (!toasts.length) return null;

  return (
    <div className="fixed inset-x-4 bottom-6 z-50 space-y-3">
      {toasts.map(t => (
        <div
          key={t.id}
          className="rounded-2xl p-4 bg-emerald-600/90 text-white shadow-lg backdrop-blur-md"
        >
          <div className="font-semibold">Produto adicionado!</div>
          <div className="opacity-90">{t.message}</div>
          <a
            href="/checkout"
            className="mt-3 inline-block rounded-xl border border-white/30 px-4 py-2 text-sm opacity-80"
          >
            Ver carrinho
          </a>
        </div>
      ))}
    </div>
  );
}