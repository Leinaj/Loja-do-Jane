// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  // Ícone simples (SVG inline) – nada para instalar
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h7.7a2 2 0 0 0 2-1.6L21 8H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.6" fill="currentColor" />
      <circle cx="18" cy="20" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { items = [] } = useCart?.() || { items: [] };

  // Soma de quantidades (aceita item.q ou item.quantity; cai para 1 se não tiver)
  const count = items.reduce<number>(
    (acc: number, it: any) => acc + (Number(it?.q ?? it?.quantity ?? 1) || 0),
    0
  );

  const isActive = (href: string) =>
    pathname === href ? "text-white" : "text-zinc-300 hover:text-white";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Logo / Nome da loja */}
        <Link href="/" className="font-semibold tracking-tight text-white">
          Loja da Jane
        </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className={isActive("/")}>
            Home
          </Link>

          <Link href="/checkout" className={isActive("/checkout")}>
            {/* Botão Carrinho com ícone */}
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-700/20 px-3 py-1.5 text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-700/30">
              <CartIcon className="h-4 w-4" />
              <span className="sr-only">Ir para o carrinho – </span>
              <span> Carrinho</span>
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