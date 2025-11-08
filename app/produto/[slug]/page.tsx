// app/produto/[slug]/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { useCart } from '../../../lib/cart';
import { products } from '../../../lib/products';

type PageProps = {
  params: { slug: string };
};

export default function ProductPage({ params }: PageProps) {
  const { add } = useCart();

  // busca o produto pelo slug
  const product = products.find((p) => p.slug === params.slug);

  // se não existir, 404
  if (!product) return notFound();

  // após o guard acima, criamos uma referência não-nula
  const p = product as (typeof products)[number];

  function handleAdd() {
    add({
      id: String(p.id),
      name: p.name,
      price: p.price,
      image: p.image, // ex.: "/moletom.jpg"
      quantity: 1,
    });
    // apenas avisa, não navega para o checkout
    alert('Produto adicionado ao carrinho!');
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          {/* Clicar na imagem = abrir em nova aba */}
          <a href={p.image} target="_blank" rel="noreferrer">
            <Image
              src={p.image}
              alt={p.name}
              width={800}
              height={800}
              className="h-auto w-full rounded-lg object-cover"
              priority
            />
          </a>
          <div className="mt-2 text-sm text-white/60">
            Toque na imagem para ver em tela cheia
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-white">{p.name}</h1>

          {p.description && (
            <p className="text-white/80">{p.description}</p>
          )}

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-emerald-400">
              R$ {p.price.toFixed(2).replace('.', ',')}
            </span>
            {p.oldPrice && (
              <span className="text-lg text-white/40 line-through">
                R$ {p.oldPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAdd}
              className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-500"
            >
              Adicionar ao carrinho
            </button>

            <Link
              href="/"
              className="rounded-lg border border-white/20 px-5 py-3 font-medium text-white hover:bg-white/5"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}