'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';

export default function Header() {
  const pathname = usePathname();
  const { items } = useCart();

  // Conta itens (usa quantity se existir)
  const cartCount = Array.isArray(items)
    ? items.reduce((acc: number, it: any) => acc + (Number(it?.quantity) || 1), 0)
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-900/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <nav className="flex gap-4 items-center">
          <Link href="/" className={`font-bold text-white text-lg ${pathname === '/' ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
            Loja da Jane
          </Link>
          <Link href="/" className={`text-sm ${pathname === '/' ? 'text-green-400' : 'text-white/80 hover:text-white'}`}>
            Home
          </Link>
          <Link href="/checkout" className={`text-sm ${pathname === '/checkout' ? 'text-green-400' : 'text-white/80 hover:text-white'}`}>
            Checkout
          </Link>
        </nav>

        {/* Carrinho com ícone 🛒 */}
        <Link
          href="/checkout"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <span role="img" aria-label="Carrinho" className="text-lg">🛒</span>
          Carrinho • {cartCount}
        </Link>
      </div>
    </header>
  );
}