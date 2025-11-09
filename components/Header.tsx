// components/Header.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';

// Ícone do carrinho (SVG inline, sem dependência externa)
function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...props}>
      <path
        d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.8" fill="currentColor" />
      <circle cx="18" cy="20" r="1.8" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const { items } = useCart();       // pega itens do carrinho
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const count = mounted ? items.length : 0;

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/70 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-white font-semibold text-lg">
          Loja da Jane
        </Link>

        <Link href="/checkout" className="relative inline-flex items-center gap-2 text-white">
          <CartIcon className="w-5 h-5" />
          <span className="text-sm">Carrinho</span>

          <span className="absolute -right-3 -top-2 rounded-full bg-emerald-500 text-black text-[10px] px-1.5 py-0.5 font-bold">
            {count}
          </span>
        </Link>
      </div>
    </header>
  );
}