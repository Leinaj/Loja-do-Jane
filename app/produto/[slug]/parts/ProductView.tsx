'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { toast } from '@/components/ui/toast';

type Product = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;        // ex.: "/moletom.jpg"
  description?: string;
  label?: string;        // "Oferta", "Promoção", etc.
};

export default function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1); // ✅ use 'quantity'

  const handleAdd = () => {
    // objeto esperado pelo seu carrinho
    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity, // ✅ aqui é 'quantity' (antes estava 'qty')
    });

    // toast elegante sem redirecionar
    toast({
      title: 'Produto adicionado!',
      description: `${quantity} × ${product.name} foi adicionado ao carrinho.`,
      variant: 'success',
      actionPrimary: { label: 'Ver carrinho', href: '/checkout' },
      actionSecondary: { label: 'Continuar comprando', href: '/' },
      durationMs: 2800,
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Imagem do produto */}
          <div className="overflow-hidden rounded-2xl bg-black/20">
            <Image
              src={product.image || '/images/placeholder.png'}
              alt={product.name}
              width={900}
              height={900}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          {/* Conteúdo */}
          <div className="space-y-5">
            {product.label && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                {product.label} <span aria-hidden>🔥</span>
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-base text-white/70">{product.description}</p>
            )}

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-emerald-400">
                {product.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
              {!!product.oldPrice && (
                <span className="text-lg text-white/40 line-through">
                  {product.oldPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              )}
            </div>

            {/* Controle de quantidade */}
            <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-2 py-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 text-2xl leading-none"
                aria-label="Diminuir"
              >
                −
              </button>
              <span className="mx-3 min-w-[2ch] text-center text-lg tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                className="px-3 text-2xl leading-none"
                aria-label="Aumentar"
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAdd}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              >
                Adicionar ao carrinho
              </button>

              <Link
                href="/"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-base font-medium text-emerald-300/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                Voltar para a loja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}