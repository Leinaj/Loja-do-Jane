'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { toast } from '@/components/ui/toast';

type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCart({ product }: { product: ProductLite }) {
  const [qty, setQty] = useState<number>(1);
  const { add } = useCart();

  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const onAdd = () => {
    const item = {
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image ?? '',
      quantity: qty,
    };

    add(item);

    // Toast simples e seguro (title + description)
    toast({
      title: 'Produto adicionado!',
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          className="h-12 w-12 rounded-2xl bg-white/5 text-2xl hover:bg-white/10 transition"
          aria-label="Diminuir"
          onClick={dec}
          type="button"
        >
          –
        </button>
        <div className="h-12 w-14 rounded-2xl bg-white/5 grid place-items-center text-lg font-semibold">
          {qty}
        </div>
        <button
          className="h-12 w-12 rounded-2xl bg-white/5 text-2xl hover:bg.white/10 transition"
          aria-label="Aumentar"
          onClick={inc}
          type="button"
        >
          +
        </button>
      </div>

      <button
        className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
        onClick={onAdd}
        type="button"
      >
        Adicionar ao carrinho
      </button>

      <a
        href="/"
        className="block w-full h-12 rounded-2xl border border-white/10 text-white/80 hover:text-white grid place-items-center transition"
      >
        Voltar para a loja
      </a>
    </div>
  );
}