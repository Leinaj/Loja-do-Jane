'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/providers/CartProvider';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CartDrawer() {
  const { items, removeItem, clear, getTotal } = useCart();
  const subtotal = getTotal();

  if (!items.length) {
    return <div className="p-4 text-neutral-300">Seu carrinho está vazio.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Carrinho</h2>

      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={String(it.id)}
            className="flex items-center gap-3 rounded-xl border border-neutral-800 p-3"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-md bg-neutral-900">
              <Image
                src={it.image || '/placeholder.png'}
                alt={it.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{it.name}</p>
              <p className="text-sm text-neutral-400">
                {it.quantity} × {formatBRL(it.price)}
              </p>
            </div>

            <button
              onClick={() => removeItem(it.id)}
              className="rounded-md bg-red-700 px-3 py-1 text-sm hover:bg-red-600"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
        <span className="text-neutral-300">Total</span>
        <strong>{formatBRL(subtotal)}</strong>
      </div>

      <div className="flex gap-2">
        <button
          onClick={clear}
          className="w-1/2 rounded-md bg-neutral-700 py-2 hover:bg-neutral-600"
        >
          Limpar carrinho
        </button>
        <Link
          href="/checkout"
          className="w-1/2 rounded-md bg-emerald-600 py-2 text-center hover:bg-emerald-500"
        >
          Ir para o checkout
        </Link>
      </div>
    </div>
  );
}