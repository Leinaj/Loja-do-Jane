// components/TopBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function TopBar() {
  const pathname = usePathname();

  // Pega o carrinho sem brigar com o TypeScript
  const cart = useCart() as any;
  const totalItems =
    cart?.totalItems ??
    cart?.items?.reduce(
      (sum: number, item: any) => sum + (item.quantity ?? 1),
      0
    ) ??
    0;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-900 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        {/* Logo / título */}
        <Link
          href="/"
          className="text-lg font-semibold text-emerald-400 tracking-tight"
        >
          Loja do Jane
        </Link>

        {/* Se NÃO estiver no checkout: mostra botão de carrinho */}
        {pathname !== "/checkout" && (
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition"
          >
            <span className="text-lg">🛒</span>
            <span>
              {totalItems === 0
                ? "0 itens"
                : totalItems === 1
                ? "1 item"
                : `${totalItems} itens`}
            </span>
          </Link>
        )}

        {/* Se estiver no checkout: não mostra o carrinho aqui
            (o botão principal de finalizar/voltar já fica na página) */}
        {pathname === "/checkout" && <div className="w-[96px]" />}
      </div>
    </header>
  );
}