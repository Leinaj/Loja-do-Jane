'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/components/cart/context';

type Toast = { id: number; text: string };

export default function ToastBridge() {
  const { lastAdded } = useCart();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (!lastAdded) return;
    const id = Date.now();
    setToasts(p => [...p, { id, text: `Produto adicionado: ${lastAdded.name}` }]);
    const t = setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3000);
    return () => clearTimeout(t);
  }, [lastAdded]);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className="rounded-xl px-4 py-3 bg-emerald-600/90 text-white shadow-lg">
          {t.text}
        </div>
      ))}
    </div>
  );
}