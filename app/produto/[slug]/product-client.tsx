'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/context';

type ProductClientProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
  };
};

export default function ProductClient({ product }: ProductClientProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const onAdd = () => {
    // envia image para o carrinho
    addItem(
      { id: product.id, name: product.name, price: product.price, image: product.image },
      qty
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* ... seu layout ... */}
      <div className="flex items-center gap-3">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 rounded-lg border">-</button>
        <span className="w-10 text-center">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 rounded-lg border">+</button>
      </div>

      <button onClick={onAdd} className="w-full rounded-full bg-emerald-600 text-white py-3">
        Adicionar ao carrinho
      </button>

      {showToast && (
        <div className="fixed left-4 right-4 bottom-6 md:left-auto md:w-[420px] md:right-6 rounded-xl bg-emerald-700/90 text-white p-4 shadow-lg">
          <div className="font-semibold">Produto adicionado!</div>
          <div className="opacity-90 text-sm mt-1">
            {qty} × {product.name} foi adicionado ao carrinho
          </div>
          <a href="/checkout" className="inline-block mt-3 px-3 py-1 rounded-full bg-white/15">Ver carrinho</a>
        </div>
      )}
    </div>
  );
}