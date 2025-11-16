import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-500/20 bg-black/90 px-4 py-3 backdrop-blur-md">
        <h1 className="text-lg font-semibold text-emerald-400">
          Loja do Jane
        </h1>

        <Link
          href="/checkout"
          className="flex items-center gap-2 rounded-full border border-emerald-400/40 px-4 py-1 text-xs font-medium text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.5)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-95"
        >
          🛒 Ver carrinho
        </Link>
      </header>

      <section className="px-4 pb-16 pt-6">
        <h2 className="text-3xl font-semibold">
          Loja do Jane — Ofertas e Moda
        </h2>
        <p className="mt-2 text-sm text-gray-300">
          Escolha seu produto e clique na foto ou em &quot;Ver&quot; para abrir a
          página de detalhes.
        </p>

        <div className="mt-6 space-y-6">
          {products.map((product) => (
            <article
              key={product.slug}
              className="rounded-3xl border border-emerald-500/40 bg-black/70 p-3 shadow-[0_0_24px_rgba(16,185,129,0.45)]"
            >
              <Link
                href={`/produto/${product.slug}`}
                className="group block"
              >
                {/* CONTAINER DA FOTO COM FEEDBACK */}
                <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-black/60 transition-all duration-150 group-active:scale-[0.97] group-active:brightness-90 group-hover:brightness-110">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 500px, 100vw"
                    className="object-cover"
                  />
                </div>

                {/* TEXTOS */}
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xl font-bold text-emerald-400">
                      {formatCurrency(product.price)}
                    </span>

                    {product.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.oldPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTÃO VER COM FEEDBACK */}
                <div className="mt-4">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/5 px-6 py-3 text-base font-semibold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-150 hover:bg-emerald-500/20 active:scale-[0.97] active:bg-emerald-500/30"
                  >
                    Ver
                  </button>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}