'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/lib/cart';

const navLink =
  'px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors';

export default function Header() {
  const pathname = usePathname();
  const { items, total, remove, clear } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // fecha ao clicar fora
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // quantidade total (soma quantities)
  const cartCount = Array.isArray(items)
    ? items.reduce((acc: number, it: any) => acc + (Number(it?.quantity) || 1), 0)
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-900/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Loja da Jane
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/" className={`${navLink} ${pathname === '/' ? 'bg-white/10' : ''}`}>
            Home
          </Link>
          <Link
            href="/checkout"
            className={`${navLink} ${
              pathname?.startsWith('/checkout') ? 'bg-white/10' : ''
            }`}
          >
            Checkout
          </Link>

          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="ml-2 flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              🛒 Carrinho • {cartCount}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-[320px] rounded-xl border border-white/10 bg-neutral-900/95 p-3 shadow-2xl">
                <div className="max-h-[50vh] overflow-auto space-y-2">
                  {items.length === 0 && (
                    <div className="text-sm text-white/70">Seu carrinho está vazio.</div>
                  )}

                  {items.map((it: any) => (
                    <div
                      key={it.id}
                      className="flex items-center gap-3 rounded-lg bg-white/5 p-2"
                    >
                      {it.image ? (
                        <Image
                          src={it.image}
                          alt={it.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-white/10" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{it.name}</div>
                        <div className="text-xs text-white/70">
                          {it.quantity} × R${' '}
                          {Number(it.price).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                      <button
                        onClick={() => remove(String(it.id))}
                        className="rounded-md px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                        title="Remover"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="text-sm text-white/80">
                    Subtotal:{' '}
                    <strong>R$ {Number(total).toFixed(2).replace('.', ',')}</strong>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={clear}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5"
                    >
                      Limpar
                    </button>
                    <Link
                      href="/checkout"
                      onClick={() => setOpen(false)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                    >
                      Ir ao checkout
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}