"use client";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function Header(){
  const { count } = useCart();
  return (
    <header className="border-b border-zinc-800 sticky top-0 backdrop-blur bg-zinc-950/70 z-40">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="font-extrabold text-xl">Loja da Jane</Link>
        <nav className="flex items-center gap-3">
          <Link className="btn-outline" href="/checkout">Checkout</Link>
          <Link className="btn" href="/checkout">Carrinho • {count}</Link>
        </nav>
      </div>
    </header>
  );
}