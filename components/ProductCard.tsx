// components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Product } from "./products/data";

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/produto/${p.slug}`}
      className="rounded-3xl bg-zinc-900 border border-zinc-800 p-4 hover:border-emerald-500/40 transition-all"
    >
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-800 relative">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover"
        />
      </div>

      <h2 className="mt-4 text-xl font-semibold">{p.name}</h2>

      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-emerald-400 text-2xl font-bold">
          R$ {brl(p.price)}
        </span>
        {p.oldPrice && (
          <span className="text-neutral-400 line-through opacity-60">
            R$ {brl(p.oldPrice)}
          </span>
        )}
      </div>
    </Link>
  );
}