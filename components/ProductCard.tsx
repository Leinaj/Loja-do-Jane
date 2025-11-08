'use client';

import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-lg">
      {/* Imagem CLICÁVEL indo para a página do produto */}
      <Link
        href={`/produto/${product.slug}`}
        className="block relative aspect-[4/3] bg-neutral-800"
        prefetch={false}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={false}
        />
      </Link>

      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold leading-tight">
            <Link href={`/produto/${product.slug}`} prefetch={false}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-white/70">
            {product.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>

        <Link
          href={`/produto/${product.slug}`}
          prefetch={false}
          className="shrink-0 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold transition-colors"
        >
          Ver produto
        </Link>
      </div>
    </article>
  );
}