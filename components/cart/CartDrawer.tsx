'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '../providers/CartProvider';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CartDrawer() {
  const { items, removeItem, getTotal } = useCart();

  return (
    <div>
      <ul className="space-y-3">
        {items.map(it => {
          const imgSrc = it.image ?? '/placeholder.png';
          const altTxt = it.name ?? 'Produto';
          return (
            <li key={String(it.id)} className="flex gap-3 items-center">
              <div className="relative w-14 h-14 rounded overflow-hidden border border-emerald-900/40">
                <Image src={imgSrc} alt={altTxt} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{it.name}</div>
                <div className="text-xs opacity-80">Qtd: {it.qty}</div>
              </div>
              <button
                onClick={() => removeItem(it.id)}
                className="text-red-500 text-sm"
              >
                Remover
              </button>
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="text-sm opacity-70">Seu carrinho está vazio.</li>
        )}
      </ul>

      <div className="mt-4 font-semibold">
        Total: {formatBRL(getTotal())}
      </div>
    </div>
  );
}