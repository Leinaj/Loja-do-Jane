'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart'; // mesmo hook que você já usa

const navLink =
  'px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors';

export default function Header() {
  const pathname = usePathname();
  const { items } = useCart();

  // Conta itens (se existir quantity usa, senão conta 1 por item)
  const cartCount = Array.isArray(items)
    ? items.reduce((acc: number, it: any) => acc + (Number(it?.quantity) || 1), 0)
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-900/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Loja da Jane
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`${navLink} ${pathname === '/' ? 'bg-white/10' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/checkout"
            className={`${navLink} ${pathname === '/checkout' ? 'bg-white/10' : ''}`}
          >
            Checkout
          </Link>

          <Link
            href="/checkout"
            aria-label="Abrir carrinho"
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold transition-colors"
          >
            <span role="img" aria-hidden="true">🛒</span>
            <span>Carrinho</span>
            <span className="ml-1 inline-flex min-w-6 items-center justify-center rounded-full bg-white/15 px-2 text-xs">
              {cartCount}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}