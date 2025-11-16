// app/produto/[slug]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const product = products.find((p) => p.slug === slug);
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    notFound();
  }

  function handleDecrease() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleIncrease() {
    setQuantity((prev) => prev + 1);
  }

  function handleAddToCart() {
    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* BOTÃO DE VOLTAR COM SETA */}
      <header className="w-full border-b border-emerald-900/40 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-start px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition active:scale-95 hover:bg-emerald-500/20 hover:border-emerald-400"
          >
            <span className="text-lg">←</span>
            <span>Voltar para a loja</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-10 pt-6">
        {/* Imagem do produto com feedback ao toque */}
        <button
          type="button"
          onClick={handleIncrease} // só pra ter um feedback se quiser, pode trocar
          className="relative overflow-hidden rounded-3xl border border-emerald-900/60 bg-zinc-900/80 shadow-[0_0_60px_rgba(16,185,129,0.25)] transition active:scale-[0.98]"
        >
          <div className="relative h-[340px] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 640px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </button>

        <section className="rounded-3xl border border-emerald-900/60 bg-zinc-950/80 p-5 shadow-[0_0_80px_rgba(16,185,129,0.18)]">
          <h1 className="text-2xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-300">{product.description}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-emerald-400">
              {product.priceFormatted}
            </span>
            {product.oldPriceFormatted && (
              <span className="text-sm text-zinc-500 line-through">
                {product.oldPriceFormatted}
              </span>
            )}
          </div>

          {/* Quantidade */}
          <div className="mt-6">
            <span className="text-sm text-zinc-300">Quantidade:</span>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={handleDecrease}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/50 bg-black/60 text-2xl text-emerald-300 transition active:scale-95 hover:bg-emerald-500/10"
              >
                –
              </button>
              <span className="w-6 text-center text-lg font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/50 bg-black/60 text-2xl text-emerald-300 transition active:scale-95 hover:bg-emerald-500/10"
              >
                +
              </button>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-14 rounded-full bg-emerald-500 text-base font-semibold text-black shadow-[0_0_40px_rgba(16,185,129,0.7)] transition active:scale-95 hover:bg-emerald-400"
            >
              Adicionar ao carrinho
            </button>

            <Link
              href="/cart"
              className="flex h-14 items-center justify-center rounded-full border border-emerald-500/60 bg-black/80 text-base font-semibold text-emerald-300 transition active:scale-95 hover:bg-emerald-500/10"
            >
              Ir para o carrinho
            </Link>
          </div>

          {/* Toast de confirmação */}
          {added && (
            <div className="mt-4 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/60 bg-black/80 px-4 py-2 text-sm text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                <span>✅</span>
                <span>Produto adicionado ao carrinho</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}