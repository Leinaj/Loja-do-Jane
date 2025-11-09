'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../cart/context';

type Toast = { id: string; message: string };

export default function ToastBridge() {
  const { lastAdded } = useCart(); // vem do provider
  const [toasts, setToasts] = useState<Toast[]>([]);

  // quando um item é adicionado, mostra um toast
  useEffect(() => {
    if (!lastAdded) return;
    const t: Toast = {
      id: crypto.randomUUID(),
      message: `Produto adicionado! ${lastAdded.qty} × ${lastAdded.name} foi adicionado ao carrinho.`,
    };
    setToasts((prev) => [t, ...prev]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== t.id));
    }, 3500);
    return () => clearTimeout(timer);
  }, [lastAdded]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="mx-auto w-full max-w-md rounded-xl bg-emerald-600/90 px-4 py-3 text-white shadow-lg backdrop-blur"
        >
          <p className="text-sm">{t.message}</p>
        </div>
      ))}
    </div>
  );
}