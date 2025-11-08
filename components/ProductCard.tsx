"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
      <Link href={`/produto/${product.slug}`} className="block">
        <Image
          src={product.image}
          alt={product.title}
          width={1200}
          height={750}
          className="w-full h-auto object-cover"
          priority
        />
      </Link>

      <div className="p-4 flex items-center justify-between gap-4">
        <div>
          <Link href={`/produto/${product.slug}`} className="text-white font-medium hover:underline">
            {product.title}
          </Link>
          <p className="text-neutral-400">R$ {product.price.toFixed(2).replace(".", ",")}</p>
        </div>

        <Link
          href={`/produto/${product.slug}`}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Ver produto
        </Link>
      </div>
    </div>
  );
}