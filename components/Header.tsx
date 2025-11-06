// components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname?.startsWith(href);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Loja do Jane
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                "rounded-xl px-3 py-2 text-sm font-medium",
                isActive(l.href)
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
              ].join(" ")}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/5544988606483"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-xl border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-950/40"
          >
            WhatsApp
          </a>
        </nav>

        {/* Mobile */}
        <button
          className="rounded-lg p-2 text-zinc-300 hover:bg-zinc-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-800 bg-zinc-950/95 md:hidden">
          <nav className="mx-auto max-w-5xl px-4 py-3">
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block rounded-xl px-3 py-2 text-sm font-medium",
                      isActive(l.href)
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/5544988606483"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-950/40"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}