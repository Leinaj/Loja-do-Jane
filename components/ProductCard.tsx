import Link from "next/link";
import Image from "next/image";
import { Product } from "@/components/products/data";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="rounded-3xl bg-neutral-900 border border-white/10 p-4 space-y-4">
      {/* container da imagem com altura/aspect ratio */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-800">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{p.name}</h3>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 text-2xl font-extrabold">
            R$ {p.price.toFixed(2).replace(".", ",")}
          </span>
          {p.oldPrice && (
            <span className="line-through opacity-60">
              R$ {p.oldPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/produto/${p.slug}`}
        className="w-full text-center rounded-full bg-emerald-600 text-white py-3"
      >
        Ver produto
      </Link>
    </div>
  );
}