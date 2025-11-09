'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/providers/CartProvider';

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  qty?: number;        // alguns lugares podem usar qty
  quantity?: number;   // outros podem usar quantity
};

export default function CartDrawer() {
  const { items, removeItem, clear } = useCart();

  // normaliza quantidade vinda do item (qty ou quantity)
  const getQty = (it: Partial<CartItem>) =>
    typeof it.qty === 'number'
      ? it.qty
      : typeof it.quantity === 'number'
      ? it.quantity
      : 1;

  const subtotal = (items as CartItem[]).reduce(
    (sum, it) => sum + (Number(it.price) || 0) * getQty(it),
    0
  );

  const totalItems = (items as CartItem[]).reduce(
    (sum, it) => sum + getQty(it),
    0
  );

  if (!items || items.length === 0) {
    return (
      <div className="p-4 text-sm text-neutral-300">
        Seu carrinho está vazio.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Carrinho ({totalItems})</h2>

      <ul className="space-y-3">
        {(items as CartItem[]).map((it) => (
          <li
            key={String(it.id)}
            className="flex items-center gap-3 border border-neutral-800 rounded-lg p-3"
          >
            {/* Imagem simples (evita erro de tipagem com next/image) */}
            <img
              src={it.image || '/placeholder.png'}
              alt={it.name}
              width={56}
              height={56}
              className="rounded-md bg-neutral-800 object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{it.name}</p>
              <p className="text-sm text-neutral-400">
                {getQty(it)} × R$ {(Number(it.price) || 0).toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => removeItem(it.id)}
              className="text-sm px-3 py-1 rounded-md bg-red-700 hover:bg-red-600"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
        <span className="text-neutral-300">Subtotal</span>
        <strong>R$ {subtotal.toFixed(2)}</strong>
      </div>

      <div className="flex gap-2">
        <button
          onClick={clear}
          className="w-1/2 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600"
        >
          Limpar
        </button>

        <Link
          href="/checkout"
          className="w-1/2 py-2 text-center rounded-md bg-emerald-600 hover:bg-emerald-500"
        >
          Ir para o checkout
        </Link>
      </div>
    </div>
  );
}