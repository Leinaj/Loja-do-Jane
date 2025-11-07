import Link from "next/link";
import Image from "next/image";
import { type Product, priceBRL } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
      <div className="relative aspect-[16/10]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-medium truncate">{product.name}</h3>
          <p className="text-sm text-zinc-400">{priceBRL(product.price)}</p>
        </div>
        <Link href={`/produto/${product.slug}`} className="btn">
          Ver produto
        </Link>
      </div>
    </article>
  );
}