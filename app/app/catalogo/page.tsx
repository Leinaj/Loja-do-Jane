import Image from "next/image";
import Link from "next/link";
import { products, formatBRL } from "@/lib/products";

export default function CatalogoPage() {
  const items = Object.values(products);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Catálogo</h1>
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((p) => (
          <article key={p.slug} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="overflow-hidden rounded-xl">
              <Image
                src={p.image}
                alt={p.title}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, 600px"
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            </div>
            <div className="mt-3">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="mt-1 text-emerald-400">{formatBRL(p.price)}</p>
              <div className="mt-3">
                <Link
                  href={`/produto/${p.slug}`}
                  className="rounded-xl border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-800"
                >
                  Ver
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}