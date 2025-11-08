'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/lib/cart';

// Tipagem para o evento customizado "open-cart"
declare global {
  interface WindowEventMap {
    'open-cart': CustomEvent<void>;
  }
}

export default function Header() {
  // Seu hook provavelmente retorna { items, add, remove, ... }
  const { items = [] } = useCart() as { items: Array<{ quantity?: number }> };

  // Conta itens: se tiver quantity soma, senão usa length
  const itemsCount = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    const hasQty = items.some((i) => typeof i?.quantity === 'number');
    return hasQty
      ? items.reduce((acc, i: any) => acc + (i.quantity ?? 0), 0)
      : items.length;
  }, [items]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('open-cart', onOpen);
    return () => {
      window.removeEventListener('open-cart', onOpen);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo / Nome da loja */}
        <Link href="/" className="font-semibold tracking-tight text-white">
          Loja da Jane
        </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/checkout"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          >
            Checkout
          </Link>

          {/* Carrinho */}
          <Link
            href="/checkout"
            className="relative inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500"
            aria-label={`Carrinho com ${itemsCount} item(s)`}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6.2 5 5.5 2.9A1 1 0 0 0 4.5 2H2a1 1 0 1 0 0 2h1.2l2.7 8.6A3 3 0 0 0 8.8 15H17a1 1 0 1 0 0-2H8.8a1 1 0 0 1-1-.7L7.6 11H18a3 3 0 0 0 2.9-2.2l.9-3.3A1 1 0 0 0 21 4H6.6a1 1 0 0 0-.4 0Z" />
            </svg>
            Carrinho
            <span className="ml-1 inline-flex min-w-[1.5rem] items-center justify-center rounded-md bg-white/15 px-1 text-xs">
              {itemsCount}
            </span>
          </Link>
        </nav>
      </div>

      {/* Drawer simples para abrir o carrinho via evento "open-cart" (opcional) */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 p-2 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="h-full w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Carrinho</h2>
              <button
                className="rounded-lg px-2 py-1 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Fechar
              </button>
            </div>
            <p className="text-sm text-white/60">
              Para finalizar, acesse o <strong>Checkout</strong>.
            </p>
            <div className="mt-4">
              <Link
                href="/checkout"
                className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                onClick={() => setOpen(false)}
              >
                Ir para o Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}