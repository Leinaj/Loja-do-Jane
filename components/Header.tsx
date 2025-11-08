"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

export default function Header() {
  const pathname = usePathname();
  const { items = [] } = useCart?.() || { items: [] };
  const count = items.reduce<number>(
    (acc: number, it: any) => acc + (Number(it?.q ?? it?.quantity ?? 1) || 0),
    0
  );

  const isActive = (href: string) =>
    pathname === href ? "text-white" : "text-zinc-300 hover:text-white";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="font-semibold tracking-tight text-white">
          Loja da Jane
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className={isActive("/")}>
            Home
          </Link>

          <Link href="/checkout" className={isActive("/checkout")}>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-700/20 px-3 py-1.5 text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-700/30">
              {/* Ícone do carrinho 🛒 */}
              <span role="img" aria-label="carrinho">
                🛒
              </span>
              <span>Carrinho</span>
              <span className="ml-1 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-emerald-500/20 px-2 text-xs font-medium text-emerald-300">
                {count}
              </span>
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}