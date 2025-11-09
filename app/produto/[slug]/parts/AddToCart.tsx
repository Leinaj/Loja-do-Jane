'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';

type Product = {
  id: string | number;
  name: string;
  price: number | string;
  image?: string;
};

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  function handleAdd() {
    addItem({
      id: String(product.id), // ✅ garante string
      title: product.name,
      price:
        typeof product.price === 'string'
          ? parseFloat(product.price.replace(',', '.'))
          : product.price, // ✅ garante number
      qty,
      image: product.image,
    });
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <button
          className="bg-neutral-700 px-3 py-2 rounded-lg"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          –
        </button>
        <span className="w-8 text-center">{qty}</span>
        <button
          className="bg-neutral-700 px-3 py-2 rounded-lg"
          onClick={() => setQty((q) => q + 1)}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="w-full py-3 bg-emerald-600 text-black font-semibold rounded-xl hover:bg-emerald-500 transition"
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}