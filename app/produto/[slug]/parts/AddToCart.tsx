'use client';

import React, { useState } from 'react';
import { useCart, ProductLite } from '@/components/providers/CartProvider';
import { toast } from '@/components/ui/toast';

export default function AddToCart({ product }: { product: ProductLite }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1 rounded bg-emerald-900/40">−</button>
        <span>{qty}</span>
        <button onClick={() => setQty(q => q + 1)} className="px-3 py-1 rounded bg-emerald-900/40">+</button>
      </div>

      <button
        onClick={() => {
          addItem(product, qty);
          toast('Produto adicionado!');
        }}
        className="px-4 py-2 rounded bg-emerald-600 text-white"
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}