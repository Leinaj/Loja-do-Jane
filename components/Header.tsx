// components/Header.tsx
"use client";

import Link from "next/link";
import { STORE } from "@/lib/config";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-zinc-100">
          {STORE.name}
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <a href="#produtos" className="text-zinc-300 hover:text-white">
            Catálogo
          </a>
          <a href="#contato" className="text-zinc-300 hover:text-white">
            Contato
          </a>
          <a
            href={`https://wa.me/${STORE.whatsappIntl.replace("+", "")}`}
            target="_blank"
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-500"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}