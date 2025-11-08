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

type Props = {
  product: ProductLite;
  defaultQty?: number;
};

export default function AddToCart({ product, defaultQty = 1 }: Props) {
  const [qty, setQty] = useState<number>(defaultQty);
  const { add } = useCart();

  const addItem = () => {
    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image ?? '',
      quantity: qty,
    });

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
    <div className="flex items-center gap-3">
      <button
        onClick={() => setQty(q => Math.max(1, q - 1))}
        className="h-10 w-10 rounded-lg bg-zinc-800 text-zinc-200 ring-1 ring-white/10"
      >
        –
      </button>
      <div className="h-10 min-w-[2.5rem] px-3 flex items-center justify-center rounded-lg bg-zinc-900 text-white ring-1 ring-white/10">
        {qty}
      </div>
      <button
        onClick={() => setQty(q => Math.min(99, q + 1))}
        className="h-10 w-10 rounded-lg bg-zinc-800 text-zinc-200 ring-1 ring-white/10"
      >
        +
      </button>

      <button
        onClick={addItem}
        className="ml-2 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-white font-medium hover:bg-emerald-500"
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}