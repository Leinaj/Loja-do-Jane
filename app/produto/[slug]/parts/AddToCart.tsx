'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/providers/CartProvider';
import { toast } from '@/components/ui/toast';

type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCart({ product }: { product: ProductLite }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const onAdd = () => {
    addItem(
      { id: product.id, name: product.name, price: product.price, image: product.image },
      qty
    );
    toast({
      title: 'Produto adicionado!',
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
      action: {
        label: 'Ver carrinho',
        onClick: () => {
          window.location.href = '/checkout';
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={dec} className="h-10 w-10 rounded-lg bg-neutral-800 text-xl">−</button>
        <div className="min-w-[48px] text-center text-lg">{qty}</div>
        <button onClick={inc} className="h-10 w-10 rounded-lg bg-neutral-800 text-xl">+</button>
      </div>

      <button
        onClick={onAdd}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-center font-medium hover:bg-emerald-500"
      >
        Adicionar ao carrinho
      </button>

      <Link
        href="/"
        className="block w-full rounded-xl border border-neutral-600 px-4 py-3 text-center hover:bg-neutral-800/60"
      >
        Voltar para a loja
      </Link>
    </div>
  );
}