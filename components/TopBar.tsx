// components/TopBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function TopBar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // --- Versão ESPECIAL só para o checkout ---
  if (pathname.startsWith("/checkout")) {
    return (
      <header className="w-full border-b border-emerald-900/40 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-start px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition active:scale-95 hover:bg-emerald-500/20 hover:border-emerald-400"
          >
            <span className="text-lg">🏠</span>
            <span>Voltar para a loja</span>
          </Link>
        </div>
      </header>
    );
  }

  // --- Versão padrão para o resto do site ---
  return (
    <header className="w-full border-b border-emerald-900/40 bg-black/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-emerald-400 text-xl font-semibold tracking-tight"
        >
          Loja do Jane
        </Link>

        <Link
          href="/cart"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition active:scale-95 hover:bg-emerald-500/20 hover:border-emerald-400"
        >
          <span>🛒</span>
          <span>
            {totalItems === 0
              ? "Carrinho vazio"
              : totalItems === 1
              ? "1 item"
              : `${totalItems} itens`}
          </span>
        </Link>
      </div>
    </header>
  );
}