'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCart } from '@/lib/cart';
import { useToast } from '@/components/ui/toast';
import Lightbox from '@/components/ui/lightbox';

const products = [
  {
    id: '1',
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    price: 159.9,
    oldPrice: 189.9,
    image: '/moletom.jpg',
    description: 'Moletom confortável em algodão, ideal para dias frios.',
    badge: 'Promoção ⚡',
  },
  {
    id: '2',
    slug: 'bone-street',
    name: 'Boné Street',
    price: 79.9,
    image: '/bone.jpg',
    description: 'Boné urbano com ajuste traseiro e acabamento premium.',
    badge: 'Oferta 🔥',
  },
  {
    id: '3',
    slug: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 49.9,
    image: '/camiseta-preta.jpg',
    description: 'Algodão penteado 30.1, caimento clássico.',
  },
  {
    id: '4',
    slug: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 49.9,
    image: '/camiseta-branca.jpg',
    description: 'Básica, confortável e versátil para o dia a dia.',
  },
];

type PageProps = { params: { slug: string } };

export default function ProductPage({ params }: PageProps) {
  const { add } = useCart();
  const { show } = useToast();
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);

  const product = useMemo(
    () => products.find((p) => p.slug === params.slug),
    [params.slug]
  );

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg border border-white/20 px-4 py-2 hover:bg-white/5"
        >
          Voltar para a loja
        </Link>
      </main>
    );
  }

  const handleAdd = () => {
    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });

    show({
      title: 'Produto adicionado!',
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
      variant: 'success',
      action: { label: 'Ver carrinho', onClick: () => (window.location.href = '/checkout') },
      duration: 2800,
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <button
            onClick={() => setOpen(true)}
            className="block w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Ampliar imagem"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={900}
              height={900}
              className="h-auto w-full rounded-xl object-cover"
              priority
            />
          </button>
        </div>

        <div className="space-y-5">
          {product.badge && (
            <span className="inline-flex items-center rounded-full bg-emerald-600/20 px-3 py-1 text-sm text-emerald-300 ring-1 ring-emerald-600/30">
              {product.badge}
            </span>
          )}
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-white/80">{product.description}</p>

          <div className="flex items-baseline gap-3">
            <div className="text-2xl font-semibold">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>
            {product.oldPrice && (
              <div className="text-lg text-white/50 line-through">
                R$ {product.oldPrice.toFixed(2).replace('.', ',')}
              </div>
            )}
          </div>

          {/* Quantidade */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-white/70">Quantidade:</span>
            <div className="inline-flex items-center rounded-xl border border-white/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-white/5"
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <input
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-12 bg-transparent text-center outline-none"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 hover:bg-white/5"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAdd}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-500 active:scale-[.99]"
            >
              Adicionar ao carrinho
            </button>

            <Link
              href="/"
              className="rounded-xl border border-white/20 px-6 py-3 font-medium transition hover:bg-white/5"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <Lightbox src={product.image} alt={product.name} onClose={() => setOpen(false)} />
      )}
    </main>
  );
}