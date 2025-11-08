'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart'; // mantém como já está no seu projeto
import { toast } from '@/components/ui/toast'; // <- caminho corrigido (veja a observação abaixo)

type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image?: string; // caminho de /public (ex.: "/moletom.jpg")
};

export default function AddToCartButton({ product }: { product: ProductLite }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  function increase() {
    setQty((q) => Math.min(q + 1, 99));
  }
  function decrease() {
    setQty((q) => Math.max(q - 1, 1));
  }

  function handleAdd() {
    if (!product) return;

    // garante ID como string para padronizar
    const item = {
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image, // exemplo: "/moletom.jpg"
      qty,
    };

    add(item);

    // Toast elegante (sem redirecionar)
    toast({
      title: 'Produto adicionado!',
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
      variant: 'success',
      actionPrimary: {
        label: 'Ver carrinho',
        href: '/checkout',
      },
      actionSecondary: {
        label: 'Continuar comprando',
        href: '/',
      },
    });

    // opcional: voltar quantidade para 1
    // setQty(1);
  }

  return (
    <div className="space-y-4">
      {/* Seletor de quantidade */}
      <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <button
          className="px-3 py-1 text-2xl leading-none opacity-80 hover:opacity-100"
          onClick={decrease}
          aria-label="Diminuir"
          type="button"
        >
          −
        </button>
        <span className="mx-4 min-w-[2ch] text-center text-lg tabular-nums">
          {qty}
        </span>
        <button
          className="px-3 py-1 text-2xl leading-none opacity-80 hover:opacity-100"
          onClick={increase}
          aria-label="Aumentar"
          type="button"
        >
          +
        </button>
      </div>

      {/* Ações */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        >
          Adicionar ao carrinho
        </button>

        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-base font-medium text-emerald-300/90 transition hover:bg-white/10 hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}