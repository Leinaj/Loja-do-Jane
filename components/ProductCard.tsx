import Image from "next/image";
import Link from "next/link";

// Tipagem do produto com campos opcionais
export type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  oldPrice?: number;
  badge?: string; // <— aqui!
};

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="rounded-2xl bg-neutral-900/60 border border-white/10 p-4 shadow-lg">
      {/* Badge só aparece se existir */}
      {p.badge && (
        <span className="inline-block mb-2 rounded-full bg-emerald-600 text-white px-3 py-1 text-xs">
          {p.badge}
        </span>
      )}

      <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      <h3 className="text-lg font-semibold mb-1">{p.name}</h3>

      <div className="mb-4">
        <span className="text-emerald-400 font-semibold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(p.price)}
        </span>
        {typeof p.oldPrice === "number" && (
          <span className="ml-3 text-sm text-neutral-400 line-through">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(p.oldPrice)}
          </span>
        )}
      </div>

      <Link
        href={`/produto/${p.slug}`}
        className="block w-full text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3"
      >
        Ver produto
      </Link>
    </div>
  );
}