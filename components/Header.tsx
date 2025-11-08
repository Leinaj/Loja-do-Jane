'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useEffect, useState } from 'react';

export default function Header() {
  const { itemsCount } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-b from-black/60 to-transparent backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Loja da Jane
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/checkout"
            className="relative rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 transition"
          >
            Carrinho
            {mounted && itemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-bold text-black shadow">
                {itemsCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}