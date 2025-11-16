// app/page.tsx
"use client";

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
    <main className="px-4 pb-20 pt-6">
      {/* TÍTULO PRINCIPAL DA PÁGINA (sem repetir o header do layout) */}
      <section className="mb-6">
        <h1 className="text-3xl font-semibold">
          Loja do Jane — Ofertas e Moda
        </h1>
        <p className="mt-2 text-sm text-gray-300">
          Escolha seu produto e clique na foto ou em &quot;Ver&quot; para abrir
          a página de detalhes.
        </p>
      </section>

      {/* LISTA DE PRODUTOS */}
      <div className="space-y-6">
        {products.map((product) => (
          <article
            key={product.slug}
            className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-black/70 shadow-[0_0_26px_rgba(16,185,129,0.6)]"
          >
            {/* FOTO CLICÁVEL COM FEEDBACK */}
            <Link
              href={`/produto/${product.slug}`}
              className="block rounded-3xl bg-black/40"
            >
              <div className="relative h-72 w-full overflow-hidden rounded-3xl transition-all duration-150 active:scale-[0.97] active:brightness-110">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </Link>

            {/* CONTEÚDO DO CARD */}
            <div className="px-4 pb-5 pt-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="mt-1 text-sm text-gray-300">
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

              {/* BOTÃO VER COM FEEDBACK NO TOQUE */}
              <Link
                href={`/produto/${product.slug}`}
                className="mt-4 block rounded-full border border-emerald-500/60 bg-black/60 py-3 text-center text-base font-semibold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.7)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-[0.97]"
              >
                Ver
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}