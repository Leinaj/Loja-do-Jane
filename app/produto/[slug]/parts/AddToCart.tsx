'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart';
import { toast } from '@/components/ui/toast';

type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCart({ product }: { product: ProductLite }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const onAdd = () => {
    add({ ...product, quantity: qty });
    // mesmo sem provider, a função é no-op (não quebra)
    toast({
      title: 'Produto adicionado!',
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
      variant: 'success',
      actionLabel: 'Ver carrinho',
      actionHref: '/checkout',
      durationMs: 2800,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={dec} className="h-10 w-10 rounded-full border text-xl">−</button>
        <span className="min-w-8 text-center text-lg">{qty}</span>
        <button onClick={inc} className="h-10 w-10 rounded-full border text-xl">+</button>
      </div>

      <button onClick={onAdd} className="w-full rounded-lg bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700">
        Adicionar ao carrinho
      </button>
    </div>
  );
}