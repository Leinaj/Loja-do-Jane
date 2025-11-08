"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((acc, it) => acc + it.q, 0);

  return (
    <header className="p-4 bg-neutral-900 text-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          Loja da Jane
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:opacity-80">Home</Link>
          <Link href="/checkout" className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 px-3 py-2 rounded-md">
            <span role="img" aria-label="carrinho">🛒</span>
            <span>Carrinho</span>
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-sm font-medium">
              {count}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}