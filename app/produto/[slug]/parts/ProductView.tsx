'use client';

import React from 'react';
import Image from 'next/image';
import AddToCart from './AddToCart';

type Product = {
  id: string | number;
  name: string;
  price: number;
  image?: string | null;
  description?: string | null;
};

const FALLBACK_IMG_DATAURL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#111827"/>
      <rect x="20" y="20" width="760" height="560" rx="16" fill="#1f2937"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="20" fill="#9ca3af" font-family="system-ui">Imagem não disponível</text>
    </svg>`
  );

export default function ProductView({ product }: { product: Product }) {
  const imgSrc =
    typeof product?.image === 'string' && product.image ? product.image : FALLBACK_IMG_DATAURL;
  const altTxt = product?.name ?? 'Produto';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/10">
          {/* unoptimized evita erro de domínio não permitido */}
          <Image
            src={imgSrc}
            alt={altTxt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <p className="mt-2 text-emerald-500 text-2xl">
              {formatBRL(product.price)}
            </p>
          </div>

          {product?.description ? (
            <p className="text-slate-300">{product.description}</p>
          ) : null}

          <AddToCart
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image ?? undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function formatBRL(value: number) {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(Number(value) || 0);
  } catch {
    return `R$ ${(Number(value || 0)).toFixed(2)}`;
  }
}