'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import CartDrawer from './cart/CartDrawer';
import { useCart } from '@/lib/cart';

const navLink =
  'px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors';

export default function Header() {
  const pathname = usePathname();
  const { items } = useCart();
  const [open, setOpen] = useState(false);

  // soma quantidades para o badge do carrinho
  const cartCount = useMemo(
    () =>
      Array.isArray(items)
        ? items.reduce((acc: number, it: any) => acc + (Number(it?.quantity) || 0), 0)
        : 0,
    [items]
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-900/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold tracking-wide">
          Loja da Jane
        </Link>

        <nav className="hidden sm:flex items-center gap-1 text-neutral-200">
          <Link
            href="/"
            className={`${navLink} ${pathname === '/' ? 'bg-white/10' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/checkout"
            className={`${navLink} ${pathname.startsWith('/checkout') ? 'bg-white/10' : ''}`}
          >
            Checkout
          </Link>
        </nav>

        {/* Botão do carrinho */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir carrinho"
          className="relative rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <span className="pointer-events-none select-none">🛒 Carrinho</span>
          <span className="ml-2 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-white/20 px-2 text-xs">
            {cartCount}
          </span>
        </button>
      </div>

      {/* Drawer do carrinho */}
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}