// components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { priceBRL } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="aspect-[16/10] w-full bg-neutral-900">
        <Image
          src={product.image}
          alt={product.title}
          width={1200}
          height={750}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">{product.title}</h3>
          <p className="opacity-80">{priceBRL(product.price)}</p>
        </div>

        <Link
          href={`/produto/${product.slug}`}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-medium hover:brightness-110"
        >
          Ver produto
        </Link>
      </div>
    </article>
  );
}