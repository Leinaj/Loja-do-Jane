// app/produto/[slug]/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PRODUCTS } from '@/components/products/data';
import { useCart } from '@/components/cart/context';

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="mb-6 text-3xl font-semibold">404 — Produto não encontrado</h1>
        <Link href="/" className="rounded-xl bg-emerald-600 px-5 py-3 text-white">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 space-y-8">
      <div className="rounded-2xl border border-white/10 p-4">
        <div className="relative h-80 w-full overflow-hidden rounded-xl bg-black/30">
          {product.image && (
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          )}
        </div>
        <h1 className="mt-6 text-3xl font-semibold">{product.name}</h1>
        <p className="mt-2 text-white/80">{product.description}</p>
        <p className="mt-4 text-2xl font-semibold text-emerald-400">{brl(product.price)}</p>

        <div className="mt-6 flex items-center gap-3">
          <button
            className="h-10 w-10 rounded-xl border border-white/10 text-xl"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            –
          </button>
          <span className="w-8 text-center">{qty}</span>
          <button
            className="h-10 w-10 rounded-xl border border-white/10 text-xl"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-500"
            onClick={() =>
              addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, qty)
            }
          >
            Adicionar ao carrinho
          </button>
          <Link
            href="/"
            className="rounded-xl border border-white/10 px-5 py-3 text-center hover:bg-white/5"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}