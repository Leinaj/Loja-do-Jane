import Image from "next/image";
import Link from "next/link";
import type { Product } from "./products/data";

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="rounded-2xl bg-neutral-900 p-4 shadow-lg">
      <div className="mb-4 overflow-hidden rounded-xl">
        {/* width/height garantem render no Next/Image em produção */}
        <Image
          src={p.image}
          alt={p.name}
          width={800}
          height={520}
          className="h-52 w-full object-cover"
          priority={false}
        />
      </div>

      <h3 className="text-xl font-semibold mb-2">{p.name}</h3>

      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-2xl text-emerald-400">R$ {brl(p.price)}</span>
        {p.oldPrice && (
          <span className="text-neutral-400 line-through opacity-60">
            R$ {brl(p.oldPrice)}
          </span>
        )}
      </div>

      <Link
        href={`/produto/${p.slug}`}
        className="block rounded-xl bg-emerald-600 py-3 text-center font-medium text-white hover:bg-emerald-500"
      >
        Ver produto
      </Link>
    </div>
  );
}