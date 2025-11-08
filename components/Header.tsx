"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import CartDrawer from "./cart/CartDrawer";

export default function Header() {
  const { items } = useCart();
  const [open, setOpen] = useState(false);

  // total de itens (somatório de quantities)
  const count = useMemo(
    () => items.reduce((acc, it) => acc + (it.quantity || 0), 0),
    [items]
  );

  // permite abrir o carrinho de qualquer lugar:  window.dispatchEvent(new CustomEvent("open-cart"))
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-cart", onOpen as EventListener);
    return () => window.removeEventListener("open-cart", onOpen as EventListener);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 mb-8 bg-[#0b1512]/60 backdrop-blur supports-[backdrop-filter]:bg-[#0b1512]/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between gap-4 py-4">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="inline-block h-8 w-8 rounded-lg bg-emerald-500/20 ring-1 ring-emerald-400/30 group-hover:bg-emerald-500/30 transition" />
              <span className="text-lg font-semibold tracking-tight">Loja da Jane</span>
            </Link>

            <nav className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 sm:inline-block"
              >
                Produtos
              </Link>
              <button
                onClick={() => setOpen(true)}
                className="relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-emerald-600/20 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-600/25"
                aria-label="Abrir carrinho"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
                  <path
                    d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Carrinho</span>
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-emerald-950 ring-2 ring-[#0b1512]">
                    {count}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Drawer do carrinho */}
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}