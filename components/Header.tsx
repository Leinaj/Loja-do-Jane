"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function Header() {
  const pathname = usePathname();
  const { items } = useCart();

  const itemsCount = items.reduce(
    (total: number, item: { quantity: number }) => total + item.quantity,
    0
  );

  const isCheckout = pathname.startsWith("/checkout");

  return (
    <header className="border-b border-zinc-900 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Loja do Jane
        </Link>

        {isCheckout ? (
          // Checkout → botão "Voltar para a loja"
          <Link
            href="/"
            className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.45)] transition
                       hover:bg-emerald-500/20 active:scale-95"
          >
            Voltar para a loja
          </Link>
        ) : (
          // Demais páginas → botão do carrinho com quantidade de itens
          <Link
            href="/checkout"
            className="flex items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.45)] transition
                       hover:bg-emerald-500/20 active:scale-95"
          >
            <ShoppingCart size={16} />
            <span>
              {itemsCount} {itemsCount === 1 ? "item" : "itens"}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}

// Export default também, pra funcionar tanto import default quanto named
export default Header;
```0