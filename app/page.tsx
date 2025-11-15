import Image from "next/image";
import Link from "next/link";
import { products } from "./data/products";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-8">

        {/* Cabeçalho */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Loja da Jane — Ofertas e Moda
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Escolha seu produto e clique na foto ou em “Ver” para abrir a página de detalhes.
          </p>
        </header>

        {/* GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg shadow-black/20"
            >
              {/* IMAGEM — CLICA E ABRE */}
              <Link href={`/produto/${product.slug}`}>
                <div className="relative w-full aspect-[4/5]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* INFOS */}
              <div className="p-4 flex flex-col gap-2">

                <h2 className="text-lg font-semibold">
                  {product.name}
                </h2>

                {product.description && (
                  <p className="text-sm text-zinc-400">
                    {product.description}
                  </p>
                )}

                {/* PREÇOS */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-emerald-400">
                    {product.priceFormatted}
                  </span>
                  {product.oldPriceFormatted && (
                    <span className="text-sm text-zinc-500 line-through">
                      {product.oldPriceFormatted}
                    </span>
                  )}
                </div>

                {/* BOTÃO VER */}
                <Link href={`/produto/${product.slug}`}>
                  <button className="mt-4 w-full rounded-full border border-emerald-500 text-emerald-400 py-2 text-sm font-medium transition-colors hover:bg-emerald-500 hover:text-black">
                    Ver
                  </button>
                </Link>

              </div>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}