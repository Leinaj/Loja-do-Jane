'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
      <Link href="/" className="text-xl font-semibold">
        Loja da Jane
      </Link>

      <Link href="/checkout" className="relative flex items-center gap-2">
        <ShoppingCart size={22} />
        {mounted && (
          <span className="text-sm bg-emerald-600 text-white px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </Link>
    </header>
  );
}