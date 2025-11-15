// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import products from "./data/products";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-8">
        {/* Cabeçalho simples */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Loja da Jane — Ofertas e Moda
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Escolha seu produto e clique na foto ou em &quot;Ver&quot; para abrir a
            página de detalhes.
          </p>
        </header>

        {/* Grid de produtos */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Link
              key={product.slug}
              href={`/produto/${product.slug}`}
              className="group rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col hover:border-emerald-500/70 transition-colors"
            >
              {/* Imagem – já é clicável porque está dentro do Link */}
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={false}
                />
              </div>

              {/* Infos do produto */}
              <div className="flex-1 flex flex-col p-4 gap-2">
                <h2 className="text-lg font-semibold group-hover:text-emerald-400 transition-colors">
                  {product.name}
                </h2>

                {product.description && (
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Preço */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-emerald-400">
                    {product.priceFormatted ?? product.price}
                  </span>
                  {product.oldPriceFormatted && (
                    <span className="text-sm text-zinc-500 line-through">
                      {product.oldPriceFormatted}
                    </span>
                  )}
                </div>

                {/* Botão Ver – também clicável porque está dentro do Link */}
                <div className="mt-4">
                  <span className="inline-flex items-center justify-center w-full rounded-full border border-emerald-500 text-emerald-400 text-sm font-medium py-2 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                    Ver
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}