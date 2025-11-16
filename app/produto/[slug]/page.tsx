// app/produto/[slug]/page.tsx
"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { useState } from "react";
import { products } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === params.slug);

  // Se não achou o produto, manda 404
  if (!product) {
    notFound();
    return null;
  }

  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  function handleDecrease() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleIncrease() {
    setQuantity((prev) => prev + 1);
  }

  function handleAddToCart() {
    // Extra: garante pro TypeScript que existe produto
    if (!product) return;

    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="px-4 pb-24 pt-6">
      {/* Imagem do produto */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-black/40">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      {/* Título e descrição */}
      <h1 className="text-2xl font-semibold text-white">{product.name}</h1>
      <p className="mt-1 text-sm text-gray-300">{product.description}</p>

      {/* Preço */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xl font-bold text-green-400">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(product.price)}
        </span>

        {product.oldPrice && (
          <span className="text-sm text-gray-500 line-through">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.oldPrice)}
          </span>
        )}
      </div>

      {/* Quantidade */}
      <div className="mt-6">
        <p className="mb-2 text-sm text-gray-200">Quantidade:</p>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleDecrease}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-600 text-2xl text-white"
          >
            −
          </button>
          <span className="text-lg font-semibold text-white">{quantity}</span>
          <button
            type="button"
            onClick={handleIncrease}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500 text-2xl text-emerald-400"
          >
            +
          </button>
        </div>
      </div>

      {/* Botão Adicionar ao carrinho */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-8 w-full rounded-full bg-emerald-500 py-4 text-center text-base font-semibold text-black shadow-[0_0_25px_rgba(16,185,129,0.7)] active:scale-[0.98] transition-transform"
      >
        Adicionar ao carrinho
      </button>

      {/* Toast "Produto adicionado" */}
      <div
        className={`mt-3 flex w-full items-center justify-center transition-all duration-500 ${
          added ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 shadow-lg shadow-emerald-500/20 backdrop-blur">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/80 text-xs">
            ✅
          </span>
          <span className="flex-1">Produto adicionado ao carrinho</span>
        </div>
      </div>

      {/* Botão Ir para o carrinho */}
      <button
        type="button"
        className="mt-4 w-full rounded-full border border-emerald-500 py-4 text-center text-base font-semibold text-emerald-400"
        onClick={() => {
          window.location.href = "/checkout";
        }}
      >
        Ir para o carrinho
      </button>
    </main>
  );
}