'use client';

import React, { useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import { toast } from '@/components/ui/toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCart({ product }: { product: ProductLite }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const add = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: qty });

    toast.success({
      title: 'Produto adicionado!',
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
      actionLabel: 'Ver carrinho',
      onAction: () => router.push('/checkout'),
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          aria-label="Diminuir"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="h-12 w-12 rounded-2xl bg-neutral-800 text-2xl leading-none hover:bg-neutral-700"
        >
          –
        </button>
        <div className="w-14 text-center text-lg">{qty}</div>
        <button
          aria-label="Aumentar"
          onClick={() => setQty((q) => q + 1)}
          className="h-12 w-12 rounded-2xl bg-neutral-800 text-2xl leading-none hover:bg-neutral-700"
        >
          +
        </button>
      </div>

      <button
        onClick={add}
        className="w-full rounded-2xl bg-emerald-600 px-6 py-4 text-center text-lg font-medium hover:bg-emerald-500"
      >
        Adicionar ao carrinho
      </button>

      <Link
        href="/"
        className="block w-full rounded-2xl border border-emerald-700/40 px-6 py-4 text-center text-lg hover:bg-emerald-600/10"
      >
        Voltar para a loja
      </Link>
    </div>
  );
}