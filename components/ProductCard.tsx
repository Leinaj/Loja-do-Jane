"use client";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  [key: string]: any; // evita erro TS se vierem campos extras
};

function money(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card group overflow-hidden">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
            priority={false}
          />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-lg bg-brand-500 px-2 py-1 text-xs font-semibold shadow-soft">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-1 text-base font-semibold">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-white">{money(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {money(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={`/produto/${product.slug}`} className="btn flex-1">
            Ver produto
          </Link>
          <Link href={`/checkout?add=${product.slug}`} className="btn-outline">
            Comprar
          </Link>
        </div>
      </div>
    </div>
  );
}