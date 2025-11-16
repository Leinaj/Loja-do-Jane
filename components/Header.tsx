"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export function Header() {
  const { items } = useCart();
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ HEADER ESPECIAL PARA O CHECKOUT
  if (isCheckout) {
    return (
      <header className="border-b border-emerald-500/20 bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-center px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition hover:bg-emerald-500/20 active:scale-95"
          >
            <span>🏠 Voltar para a loja</span>
          </Link>
        </div>
      </header>
    );
  }

  // ✅ HEADER NORMAL NAS OUTRAS PÁGINAS
  return (
    <header className="border-b border-emerald-500/20 bg-black/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-emerald-300"
        >
          Loja do Jane
        </Link>

        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500 px-4 py-2 text-sm font-medium text-black shadow-[0_0_30px_rgba(16,185,129,0.6)] transition hover:bg-emerald-400 active:scale-95"
        >
          <span>🛒</span>
          <span>
            {itemsCount} {itemsCount === 1 ? "item" : "itens"}
          </span>
        </Link>
      </div>
    </header>
  );
}