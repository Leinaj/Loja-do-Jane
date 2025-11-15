"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

type ProductProps = {
  product: {
    id: number;
    slug: string;
    name: string;
    price: number;
    priceFormatted?: string;
    oldPrice?: number;
    oldPriceFormatted?: string;
    description?: string;
    image: string;
  };
};

export default function ProductClient({ product }: ProductProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  function handleDecrease() {
    setQty((prev) => (prev > 1 ? prev - 1 : 1));
  }

  function handleIncrease() {
    setQty((prev) => prev + 1);
  }

  function handleAddToCart() {
    if (!product) return;

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 pb-16 pt-8">
        {/* Botão voltar */}
        <div className="mb-4">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            ← Voltar para a loja
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-6">
          {/* Imagem grande */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] bg-white rounded-3xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </div>

          {/* Infos / ações */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-zinc-400 text-sm mt-2">
                  {product.description}
                </p>
              )}
            </div>

            {/* Preço */}
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-emerald-400">
                  {product.priceFormatted ?? `R$ ${product.price.toFixed(2)}`}
                </span>
                {product.oldPriceFormatted && (
                  <span className="text-sm text-zinc-500 line-through">
                    {product.oldPriceFormatted}
                  </span>
                )}
              </div>
            </div>

            {/* Quantidade */}
            <div className="mt-4">
              <span className="block text-sm mb-2 text-zinc-300">
                Quantidade:
              </span>
              <div className="inline-flex items-center gap-4 bg-zinc-950 border border-zinc-800 rounded-full px-4 py-2">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-lg"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center">{qty}</span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-8 h-8 rounded-full border border-emerald-500 flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botões */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full rounded-full bg-emerald-500 text-black font-semibold py-3 shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:bg-emerald-400 transition-colors"
              >
                Adicionar ao carrinho
              </button>

              <Link
                href="/checkout"
                className="w-full rounded-full border border-zinc-700 text-zinc-200 font-medium py-3 text-center hover:border-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Ir para o carrinho
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}