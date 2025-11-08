// components/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/products';

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="rounded-2xl bg-neutral-900/60 border border-white/10 p-4 shadow-lg">
      {p.badge ? (
        <span className="inline-block mb-2 text-xs px-3 py-1 rounded-full bg-emerald-600 text-white">
          {p.badge}
        </span>
      ) : null}

      {/* CLICOU NA FOTO -> vai para a página do produto */}
      <Link href={`/produto/${p.slug}`} className="block relative w-full h-56">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </Link>

      <div className="mt-4 space-y-1">
        <div className="text-lg font-semibold">{p.name}</div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">
            R$ {p.price.toFixed(2).replace('.', ',')}
          </span>
          {p.oldPrice ? (
            <span className="text-white/50 line-through">
              R$ {p.oldPrice.toFixed(2).replace('.', ',')}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/produto/${p.slug}`}
          className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 transition px-4 py-3 font-medium"
        >
          Ver produto
        </Link>
      </div>
    </div>
  );
}