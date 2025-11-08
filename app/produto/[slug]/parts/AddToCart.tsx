'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';

type ProductLike = {
  id: string | number;
  name: string;
  price: number;
  image: string;
};

export default function AddToCartButton({ product }: { product: ProductLike }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const safeId = String(product.id); // garante id como string

  const handleAdd = () => {
    add(
      {
        id: safeId,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      qty
    );
  };

  return (
    <div className="mt-4 flex gap-3">
      <div className="flex items-center rounded-lg border border-white/10">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2 text-lg"
          aria-label="Diminuir quantidade"
        >
          –
        </button>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="w-14 bg-transparent text-center outline-none"
        />
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="px-3 py-2 text-lg"
          aria-label="Aumentar quantidade"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition font-medium px-4"
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}