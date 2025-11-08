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

export default function AddToCartButton({ product }: { product: ProductLite }) {
  const { add } = useCart();
  const [qty, setQty] = useState<number>(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const handleAdd = () => {
    if (!product) return;

    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });

    toast.success({
      title: 'Produto adicionado!',
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
      action: {
        label: 'Ver carrinho',
        onClick: () => {
          // abre o drawer e mantém o toast
          // @ts-expect-error evento customizado
          window.dispatchEvent(new Event('open-cart'));
        },
      },
    });

    // abre o drawer mesmo se o usuário não clicar no botão do toast
    // @ts-expect-error evento customizado
    window.dispatchEvent(new Event('open-cart'));
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      {/* Stepper */}
      <div className="flex h-12 items-center justify-between rounded-xl border border-white/10 bg-neutral-800/60 px-2 text-white sm:w-40">
        <button
          onClick={dec}
          aria-label="Diminuir quantidade"
          className="h-9 w-9 rounded-lg bg-white/10 text-lg leading-none hover:bg-white/20"
        >
          −
        </button>
        <span className="select-none tabular-nums">{qty}</span>
        <button
          onClick={inc}
          aria-label="Aumentar quantidade"
          className="h-9 w-9 rounded-lg bg-white/10 text-lg leading-none hover:bg-white/20"
        >
          +
        </button>
      </div>

      {/* Botão principal */}
      <button
        onClick={handleAdd}
        className="h-12 flex-1 rounded-xl bg-emerald-600 px-4 text-white font-medium shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        Adicionar ao carrinho
      </button>

      {/* Voltar */}
      <a
        href="/"
        className="h-12 rounded-xl border border-emerald-700/40 bg-emerald-900/10 px-4 text-emerald-300 transition hover:bg-emerald-900/20 flex items-center justify-center"
      >
        Voltar para a loja
      </a>
    </div>
  );
}