// components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Product } from "./products/data";

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

type Props = {
  product: Product;
};

export function ProductCard({ product: p }: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 flex flex-col gap-4">
      {/* IMAGEM */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 aspect-[16/9]">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 400px, 100vw"
        />
      </div>

      {/* INFO */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg text-white">{p.name}</h3>

        <div className="mb-2 flex items-baseline gap-3">
          <span className="text-2xl text-emerald-400">R$ {brl(p.price)}</span>
          {typeof p.oldPrice === "number" && (
            <span className="text-neutral-400 line-through opacity-60">
              R$ {brl(p.oldPrice)}
            </span>
          )}
        </div>

        <Link
          href={`/produto/${p.slug}`}
          className="mt-2 inline-flex items-center justify-center rounded-2xl bg-emerald-500 text-white font-medium py-2.5"
        >
          Ver produto
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;