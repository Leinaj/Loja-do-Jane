"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { products, type Product } from "@/lib/products";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type PageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: PageProps) {
  const { slug } = params;
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const safeProduct = product as Product;

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleIncrement() {
    setQuantity((prev) => prev + 1);
  }

  function handleDecrement() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleAddToCart() {
    addToCart(
      {
        id: safeProduct.id,
        slug: safeProduct.slug,
        name: safeProduct.name,
        price: safeProduct.price,
        description: safeProduct.description,
        image: safeProduct.image,
        oldPrice: safeProduct.oldPrice,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* topo */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-500/20 bg-black/90 px-4 py-3 backdrop-blur-md">
        <h1 className="text-lg font-semibold text-emerald-400">Loja do Jane</h1>
      </header>

      <section className="px-4 pb-16 pt-6">
        {/* imagem */}
        <div className="overflow-hidden rounded-3xl bg-black">
          <div className="relative h-80 w-full">
            <Image
              src={safeProduct.image}
              alt={safeProduct.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* infos do produto */}
        <div className="mt-5">
          <h2 className="text-2xl font-semibold text-white">
            {safeProduct.name}
          </h2>
          <p className="mt-1 text-sm text-gray-300">
            {safeProduct.description}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-emerald-400">
              {formatCurrency(safeProduct.price)}
            </span>

            {safeProduct.oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(safeProduct.oldPrice)}
              </span>
            )}
          </div>

          {/* quantidade */}
          <div className="mt-6">
            <p className="mb-3 text-sm text-gray-300">Quantidade:</p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={handleDecrement}
                className="
                  flex h-12 w-12 items-center justify-center rounded-full
                  border border-emerald-500/60 text-2xl text-emerald-300
                  transition-all duration-150
                  active:scale-95 active:bg-emerald-500/10
                  focus:outline-none focus:ring-2 focus:ring-emerald-400/70
                "
              >
                −
              </button>

              <span className="text-lg">{quantity}</span>

              <button
                type="button"
                onClick={handleIncrement}
                className="
                  flex h-12 w-12 items-center justify-center rounded-full
                  border border-emerald-500/60 text-2xl text-emerald-300
                  transition-all duration-150
                  active:scale-95 active:bg-emerald-500/10
                  focus:outline-none focus:ring-2 focus:ring-emerald-400/70
                "
              >
                +
              </button>
            </div>
          </div>

          {/* BOTÃO PRINCIPAL */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="
              mt-8 w-full rounded-full bg-emerald-500
              py-4 text-center text-base font-semibold text-black
              shadow-[0_0_25px_rgba(16,185,129,0.7)]
              transition-all duration-150
              active:scale-95 active:bg-emerald-400
              focus:outline-none focus:ring-2 focus:ring-emerald-400/70
            "
          >
            Adicionar ao carrinho
          </button>

          {/* TOAST BONITINHO ENTRE OS BOTÕES */}
          {added && (
            <div className="mt-3 flex w-full items-center justify-center">
              <div
                className="
                  flex items-center gap-2 rounded-full border border-emerald-500/60
                  bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300
                  shadow-[0_0_18px_rgba(16,185,129,0.4)] backdrop-blur-sm
                "
              >
                <span className="rounded-full bg-emerald-500/80 p-1 text-xs leading-none text-black">
                  ✓
                </span>
                <span>Produto adicionado ao carrinho</span>
              </div>
            </div>
          )}

          {/* BOTÃO SECUNDÁRIO */}
          <button
            type="button"
            className="
              mt-4 w-full rounded-full border border-emerald-500
              py-4 text-center text-base font-semibold text-emerald-400
              transition-all duration-150
              active:scale-95 active:bg-emerald-500/10
              focus:outline-none focus:ring-2 focus:ring-emerald-400/70
            "
            onClick={() => {
              window.location.href = "/checkout";
            }}
          >
            Ir para o carrinho
          </button>
        </div>
      </section>
    </main>
  );
}