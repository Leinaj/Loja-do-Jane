'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useCart } from '@/lib/cart';

const FALLBACK_IMG_DATAURL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#6b7280">sem imagem</text></svg>`
  );

export default function CartDrawer() {
  const { items, remove, clear, total } = useCart();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Carrinho</h2>

      <ul className="space-y-3">
        {items.map((it: any) => {
          const imgSrc = typeof it?.image === 'string' && it.image ? it.image : FALLBACK_IMG_DATAURL;
          const altTxt = it?.name ?? 'Produto';
          const id = String(it?.id ?? Math.random());

          return (
            <li key={id} className="flex items-center gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-md ring-1 ring-black/10">
                <Image src={imgSrc} alt={altTxt} fill className="object-cover" sizes="64px" />
              </div>

              <div className="flex-1">
                <p className="font-medium">{altTxt}</p>
                <p className="text-sm opacity-70">{formatBRL(Number(it?.price ?? 0))}</p>
              </div>

              <button
                onClick={() => remove(it?.id)}
                className="rounded-md bg-rose-600 px-3 py-1 text-sm text-white hover:bg-rose-700"
              >
                Remover
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-base font-semibold">Total</span>
        <span className="text-base font-semibold">{formatBRL(total)}</span>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={clear} className="rounded-md border px-3 py-2">Limpar carrinho</button>
        <Link href="/checkout" className="rounded-md bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">
          Finalizar pedido
        </Link>
      </div>
    </div>
  );
}

function formatBRL(value: number) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(Number(value) || 0);
  } catch {
    return `R$ ${(Number(value || 0)).toFixed(2)}`;
  }
}