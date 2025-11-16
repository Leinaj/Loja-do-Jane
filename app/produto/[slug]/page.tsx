"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);

  // se der algum slug estranho, só mostra mensagem simples
  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Produto não encontrado.</p>
      </main>
    );
  }

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleDecrease() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleIncrease() {
    setQuantity((prev) => prev + 1);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-500/20 bg-black/90 px-4 py-3 backdrop-blur-md">
        <Link
          href="/"
          className="text-lg font-semibold text-emerald-400 hover:text-emerald-300"
        >
          Loja do Jane
        </Link>

        <Link
          href="/checkout"
          className="flex items-center gap-2 rounded-full border border-emerald-400/40 px-4 py-1 text-xs font-medium text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.5)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-95"
        >
          🛒 Ir para o carrinho
        </Link>
      </header>

      <section className="px-4 pb-20 pt-6">
        {/* FOTO COM FEEDBACK NO TOQUE */}
        <div className="rounded-3xl bg-black/50 p-2">
          <div className="relative overflow-hidden rounded-3xl bg-black/60 shadow-[0_0_26px_rgba(16,185,129,0.45)] transition-all duration-150 active:scale-[0.97] active:brightness-90">
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* TEXTO / PREÇOS */}
        <div className="mt-5">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-1 text-sm text-gray-400">{product.description}</p>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-emerald-400">
              {formatCurrency(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        {/* CONTROLE DE QUANTIDADE */}
        <div className="mt-6">
          <p className="text-sm text-gray-300">Quantidade:</p>
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={handleDecrease}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 text-2xl text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.45)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-95 active:bg-emerald-500/20"
            >
              –
            </button>

            <span className="w-6 text-center text-lg font-medium">
              {quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/40 text-2xl text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.45)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-95 active:bg-emerald-500/20"
            >
              +
            </button>
          </div>
        </div>

        {/* BOTÃO PRINCIPAL + SEGUNDO BOTÃO */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-full bg-emerald-500 py-4 text-center text-base font-semibold text-black shadow-[0_0_30px_rgba(16,185,129,0.9)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.97] active:bg-emerald-300"
          >
            Adicionar ao carrinho
          </button>

          <Link
            href="/checkout"
            className="flex w-full items-center justify-center rounded-full border border-emerald-500/60 bg-black/60 px-6 py-3 text-base font-semibold text-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.55)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-[0.97] active:bg-emerald-500/20"
          >
            Ir para o carrinho
          </Link>
        </div>

        {/* TOAST "PRODUTO ADICIONADO" */}
        {added && (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.6)]">
              <span className="text-lg">✅</span>
              <span>Produto adicionado ao carrinho</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}