'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';
// ✅ importa via caminho relativo para evitar problema com alias
import { toast } from '../../../../components/ui/toast';

type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image: string;
};

export default function AddToCart({ product }: { product: ProductLite }) {
  const [qty, setQty] = useState<number>(1);
  const { add } = useCart();

  const handleAdd = () => {
    const item = {
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    };

    add(item);

    toast({
      title: 'Produto adicionado!',
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
      variant: 'success',
      action: { label: 'Ver carrinho', href: '/checkout' },
      duration: 2800,
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="h-10 w-10 rounded-xl border border-zinc-700 text-xl text-white/90 transition hover:bg-white/10"
          aria-label="Diminuir quantidade"
        >
          −
        </button>
        <div className="min-w-[64px] rounded-xl border border-zinc-700 px-3 py-2 text-center text-white/90">
          {qty}
        </div>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="h-10 w-10 rounded-xl border border-zinc-700 text-xl text-white/90 transition hover:bg-white/10"
          aria-label="Aumentar quantidade"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="h-11 rounded-2xl bg-emerald-600 px-5 font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 sm:ml-3"
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}