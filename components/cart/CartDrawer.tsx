'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ⚠️ ajuste o caminho relativo conforme sua estrutura.
// Este caminho funciona se o arquivo estiver em components/cart/CartDrawer.tsx
import { useCart } from '../../app/providers/CartProvider';

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number.isFinite(v) ? v : 0
  );

// Imagem inline (1x1) para fallback caso não exista it.image
const FALLBACK_DATA_URL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="%23222222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="%23aaaaaa">sem imagem</text></svg>';

export default function CartDrawer() {
  const { items, removeItem, clearCart } = useCart();

  const subtotal = items.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0),
    0
  );

  return (
    <aside className="w-full max-w-md p-4 bg-black/30 backdrop-blur rounded-xl border border-white/10">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Seu carrinho</h2>
        <button
          type="button"
          onClick={() => clearCart()}
          className="px-3 py-1.5 rounded-md border border-white/15 hover:bg-white/5 transition"
        >
          Limpar
        </button>
      </header>

      {!items.length && <p className="text-white/70">Carrinho vazio.</p>}

      <ul className="space-y-3">
        {items.map((it) => {
          const imgSrc = it.image ?? FALLBACK_DATA_URL; // ← garante string
          const altTxt = it.name ?? 'Produto'; // ← garante string

          return (
            <li
              key={String(it.id)}
              className="flex gap-3 rounded-lg border border-white/10 p-3 bg-black/20"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-md shrink-0">
                <Image
                  src={imgSrc}
                  alt={altTxt}
                  fill
                  sizes="64px"
                  className="object-cover"
                  priority={false}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{altTxt}</p>
                <p className="text-sm text-white/70">
                  {it.quantity} × {formatBRL(Number(it.price) || 0)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeItem(it.id)}
                className="self-start px-3 py-1.5 rounded-md bg-rose-700/70 hover:bg-rose-700 transition"
              >
                Remover
              </button>
            </li>
          );
        })}
      </ul>

      <footer className="mt-4 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-white/70">Subtotal</span>
          <strong>{formatBRL(subtotal)}</strong>
        </div>

        <div className="mt-3 grid gap-2">
          <Link
            href="/checkout"
            className="text-center w-full rounded-lg px-4 py-2 bg-emerald-600 hover:bg-emerald-500 transition"
          >
            Ir para o checkout
          </Link>
        </div>
      </footer>
    </aside>
  );
}