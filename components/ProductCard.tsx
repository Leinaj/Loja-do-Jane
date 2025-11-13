// components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "./products/data";

type Props = {
  product: Product;
};

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export function ProductCard({ product: p }: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 md:p-6 flex flex-col gap-4">
      <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-800 relative">
        <Image
          src={`/${p.image}`} // 👈 agora busca direto da pasta /public
          alt={p.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">{p.name}</h2>

        <div className="mb-2 flex items-baseline gap-3">
          <span className="text-2xl text-emerald-400">
            R$ {brl(p.price)}
          </span>

          {p.oldPrice && (
            <span className="text-neutral-400 line-through opacity-60">
              R$ {brl(p.oldPrice)}
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/produto/${p.slug}`} // 👈 slug bate com o data.ts
        className="mt-auto inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition"
      >
        Ver produto
      </Link>
    </div>
  );
}