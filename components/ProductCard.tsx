"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <article className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/60 transition">
      <div className="relative aspect-[16/10]">
        {/* Usamos next/image com as imagens do /public */}
        <Image
          src={`/${product.image}`}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
        <p className="text-zinc-400 mt-1">R$ {product.price.toFixed(2)}</p>

        <div className="mt-4">
          <Link
            href={`/produto/${product.slug}`}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-medium text-black"
          >
            Ver produto
          </Link>
        </div>
      </div>
    </article>
  );
}