"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/lib/products";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function HomePage() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* topo fixo com nome da loja e carrinho */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-500/20 bg-black/90 px-4 py-3 backdrop-blur-md">
        <h1 className="text-lg font-semibold text-emerald-400">Loja do Jane</h1>

        <Link
          href="/checkout"
          className="
            flex items-center gap-2 rounded-full border border-emerald-500/50
            px-4 py-2 text-sm text-emerald-300
            shadow-[0_0_15px_rgba(16,185,129,0.5)]
            transition-all duration-150
            active:scale-95 active:bg-emerald-500/10
            focus:outline-none focus:ring-2 focus:ring-emerald-400/70
          "
        >
          <span className="text-lg">🛒</span>
          <span>
            {cartCount === 0
              ? "Carrinho vazio"
              : cartCount === 1
              ? "1 item"
              : `${cartCount} itens`}
          </span>
        </Link>
      </header>

      <section className="px-4 pb-10 pt-6">
        <h2 className="text-3xl font-bold text-white">
          Loja do Jane — Ofertas e Moda
        </h2>
        <p className="mt-3 text-sm text-gray-300">
          Escolha seu produto e clique na foto ou em &quot;Ver&quot; para abrir
          a página de detalhes.
        </p>

        <div className="mt-6 space-y-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-black/80 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
            >
              {/* IMAGEM – CLICÁVEL */}
              <Link
                href={`/produto/${product.slug}`}
                className="block overflow-hidden rounded-b-3xl rounded-t-3xl bg-black"
              >
                <div className="relative h-72 w-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="px-5 pb-5 pt-4">
                <h3 className="text-xl font-semibold text-white">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  {product.description}
                </p>

                {/* PREÇOS */}
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

                {/* BOTÃO VER – COM FEEDBACK DE TOQUE */}
                <Link href={`/produto/${product.slug}`} className="block">
                  <button
                    type="button"
                    className="
                      mt-4 w-full rounded-full border border-emerald-500
                      bg-transparent py-3 text-base font-semibold text-emerald-400
                      shadow-[0_0_20px_rgba(16,185,129,0.4)]
                      transition-all duration-150
                      active:scale-95 active:bg-emerald-500/10 active:shadow-[0_0_30px_rgba(16,185,129,0.7)]
                      focus:outline-none focus:ring-2 focus:ring-emerald-400/70
                    "
                  >
                    Ver
                  </button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}