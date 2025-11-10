'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/context';

type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  description?: string;
};

export default function ProductClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  function handleAdd() {
    if (!product) return;

    // addItem NÃO aceita quantity/qty no objeto.
    // Se quiser adicionar mais de 1, chamamos N vezes.
    for (let i = 0; i < Math.max(1, qty); i++) {
      addItem({
        id: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-zinc-400">Quantidade</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value) || 1)}
          className="w-20 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />
      </div>

      <button
        onClick={handleAdd}
        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}