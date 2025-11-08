'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Payload = { name?: string };

export default function CartNotice() {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const onAdded = (e: Event) => {
      const detail = (e as CustomEvent<Payload>).detail;
      setItemName(detail?.name);
      setOpen(true);
      // auto-fechar depois de 3.5s (se o usuário não clicar)
      const t = setTimeout(() => setOpen(false), 3500);
      return () => clearTimeout(t);
    };

    window.addEventListener('cart:item-added', onAdded as EventListener);
    return () =>
      window.removeEventListener('cart:item-added', onAdded as EventListener);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-[95%] max-w-xl">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-neutral-900/90 px-4 py-3 shadow-xl backdrop-blur">
        <div className="text-sm text-white">
          <strong>{itemName ?? 'Item'}</strong> adicionado ao carrinho ✅
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            Voltar pra loja
          </Link>
          <Link
            href="/checkout"
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            Ir ao checkout
          </Link>
        </div>
      </div>
    </div>
  );
}