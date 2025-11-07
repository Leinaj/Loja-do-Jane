// components/Header.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function Header() {
  const { getCartCount } = useCart();

  return (
    <header className="p-4 flex items-center justify-between border-b border-white/10 bg-white/5">
      <Link href="/" className="text-lg font-bold">
        Loja da Jane
      </Link>

      <nav className="flex items-center gap-4">
        <Link className="btn" href="/">
          Home
        </Link>

        <Link className="btn" href="/checkout">
          Checkout
        </Link>

        <Link className="btn" href="/carrinho">
          Carrinho • {getCartCount()}
        </Link>
      </nav>
    </header>
  );
}