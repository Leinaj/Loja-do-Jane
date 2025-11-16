// components/TopBar.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function TopBar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full border-b border-zinc-900 bg-black/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Loja do Jane
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors hidden sm:inline"
          >
            Início
          </Link>

          <Link
            href="/checkout"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/70 hover:bg-emerald-500 hover:text-black transition-colors"
          >
            <span>🛒</span>
            <span>
              {totalItems === 0
                ? "Carrinho vazio"
                : `${totalItems} item${totalItems > 1 ? "s" : ""}`}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}