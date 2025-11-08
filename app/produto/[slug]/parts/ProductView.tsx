'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { toast } from '@/components/ui/toast';

type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  description?: string;
  badge?: string;
};

type Props = {
  product: Product;
};

export default function ProductView({ product }: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const { add } = useCart();

  const dec = () => setQuantity(q => Math.max(1, q - 1));
  const inc = () => setQuantity(q => Math.min(99, q + 1));

  const handleAdd = () => {
    // item no formato esperado pelo carrinho
    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });

    // ✅ toast somente com chaves tipadas
    toast({
      title: 'Produto adicionado!',
      description: `${quantity} × ${product.name} foi adicionado ao carrinho.`,
      variant: 'success',
      actionLabel: 'Ver carrinho',
      actionHref: '/checkout',
      durationMs: 2800,
    });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12">
      {/* Imagem */}
      <div className="rounded-3xl bg-gradient-to-b from-emerald-900/40 to-transparent p-2 sm:p-3 mb-6 sm:mb-10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
        <div>
          {product.badge && (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-900/30 px-3 py-1.5 text-emerald-300 text-sm ring-1 ring-emerald-700/40">
              {product.badge}
              <span aria-hidden>🔥</span>
            </span>
          )}

          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-4 text-zinc-300/90 leading-relaxed">
              {product.description}
            </p>
          )}

          <p className="mt-6 text-3xl sm:text-4xl font-bold text-emerald-300">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(product.price)}
          </p>
        </div>

        {/* Ações */}
        <div className="space-y-6">
          {/* Quantidade */}
          <div>
            <label className="block text-zinc-400 mb-2">Quantidade:</label>
            <div className="flex items-center gap-3">
              <button
                onClick={dec}
                className="h-12 w-12 rounded-xl bg-zinc-800/80 text-zinc-200 text-xl ring-1 ring-white/10 hover:bg-zinc-800"
                aria-label="Diminuir quantidade"
              >
                –
              </button>
              <div className="h-12 min-w-[3rem] px-4 flex items-center justify-center rounded-xl bg-zinc-900/70 text-white ring-1 ring-white/10">
                {quantity}
              </div>
              <button
                onClick={inc}
                className="h-12 w-12 rounded-xl bg-zinc-800/80 text-zinc-200 text-xl ring-1 ring-white/10 hover:bg-zinc-800"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAdd}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-600 px-6 text-white font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              Adicionar ao carrinho
            </button>

            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-transparent px-6 text-emerald-300 font-medium ring-1 ring-emerald-700/40 hover:bg-emerald-900/20"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}