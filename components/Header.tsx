"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function Header() {
  const { getCartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Loja da Jane</Link>

        <nav className="flex items-center gap-2">
          <Link href="/" className="btn-ghost">Home</Link>
          <Link href="/checkout" className="btn-ghost">Checkout</Link>
          <Link href="/checkout" className="btn">
            Carrinho • {getCartCount()}
          </Link>
        </nav>
      </div>
    </header>
  );
}