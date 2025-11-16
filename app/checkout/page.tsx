"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";

type ProductPageProps = {
  params: { slug: string };
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ProductPage({ params }: ProductPageProps) {
  const { addToCart } = useCart();
  const product = products.find((p) => p.slug === params.slug);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Se não achar o produto, mostra uma página simples
  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="px-6 text-center">
          <h1 className="text-2xl font-bold">Produto não encontrado</h1>
          <p className="mt-2 text-sm text-gray-400">
            Parece que este item sumiu do estoque.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-black shadow-[0_0_18px_rgba(16,185,129,0.7)] transition-all duration-150 hover:bg-emerald-400 active:scale-95"
          >
            Voltar para a loja
          </Link>
        </div>
      </main>
    );
  }

  function handleAddToCart() {
    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        oldPrice: product.oldPrice,
        priceFormatted: product.priceFormatted,
        oldPriceFormatted: product.oldPriceFormatted,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function increaseQuantity() {
    setQuantity((prev) => prev + 1);
  }

  function decreaseQuantity() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-500/20 bg-black/90 px-4 py-3 backdrop-blur-md">
        <h1 className="text-lg font-semibold text-emerald-400">Loja do Jane</h1>

        <Link
          href="/checkout"
          className="flex items-center gap-2 rounded-full border border-emerald-400/40 px-4 py-1 text-xs font-medium text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.5)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-95"
        >
          <span className="text-base">🛒</span>
          <span>Ir para o carrinho</span>
        </Link>
      </header>

      <section className="px-4 pb-16 pt-6">
        {/* IMAGEM COM FEEDBACK DE TOQUE */}
        <div className="mb-4 overflow-hidden rounded-3xl border border-emerald-500/30 bg-black/60 shadow-[0_0_22px_rgba(16,185,129,0.25)]">
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            priority
            className="h-[280px] w-full object-cover transition-transform duration-150 hover:scale-[1.02] active:scale-95"
          />
        </div>

        {/* TEXTO */}
        <h2 className="text-2xl font-semibold text-white">{product.name}</h2>
        <p className="mt-1 text-sm text-gray-300">{product.description}</p>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-emerald-400">
            {formatCurrency(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </div>

        {/* QUANTIDADE */}
        <div className="mt-6">
          <p className="text-sm text-gray-300">Quantidade:</p>
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={decreaseQuantity}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 text-xl text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.4)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-95"
            >
              −
            </button>

            <span className="w-6 text-center text-lg font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 text-xl text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.4)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-full bg-emerald-500 py-4 text-center text-base font-semibold text-black shadow-[0_0_28px_rgba(16,185,129,0.8)] transition-all duration-150 hover:bg-emerald-400 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
          >
            Adicionar ao carrinho
          </button>

          <Link
            href="/checkout"
            className="flex w-full items-center justify-center rounded-full border border-emerald-400/60 bg-black/40 py-3 text-sm font-semibold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-95"
          >
            Ir para o carrinho
          </Link>
        </div>

        {/* TOAST "PRODUTO ADICIONADO" */}
        {added && (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-200 shadow-[0_0_22px_rgba(16,185,129,0.6)] backdrop-blur-md">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs text-black">
                ✔
              </span>
              <span>Produto adicionado ao carrinho</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}