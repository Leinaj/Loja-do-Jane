// app/produto/[slug]/product-client.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/app/data/products";

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const handleDecrease = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQty((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-8">
        {/* Voltar */}
        <Link
          href="/"
          className="text-sm text-emerald-400 hover:underline inline-flex items-center gap-1"
        >
          ← Voltar para a loja
        </Link>

        {/* Card principal */}
        <div className="mt-4 rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden">
          {/* Imagem grande */}
          <div className="relative w-full aspect-[4/5] bg-black">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>

          {/* Infos do produto */}
          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              {product.description && (
                <p className="text-sm text-zinc-400 mt-1">
                  {product.description}
                </p>
              )}
            </div>

            {/* Preços */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-emerald-400">
                {product.priceFormatted ?? product.price}
              </span>
              {product.oldPriceFormatted && (
                <span className="text-sm text-zinc-500 line-through">
                  {product.oldPriceFormatted}
                </span>
              )}
            </div>

            {/* Quantidade */}
            <div className="pt-2">
              <span className="text-sm text-zinc-300">Quantidade:</span>
              <div className="mt-2 inline-flex items-center rounded-full border border-zinc-700 px-3 py-1 gap-4">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-lg"
                >
                  −
                </button>
                <span className="w-8 text-center text-base">{qty}</span>
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
            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full rounded-full bg-emerald-500 text-black font-medium py-3 shadow-[0_0_40px_rgba(16,185,129,0.7)] active:scale-[0.99] transition-transform"
              >
                Adicionar ao carrinho
              </button>

              <Link
                href="/checkout"
                className="block w-full text-center rounded-full border border-emerald-500 text-emerald-400 font-medium py-3 hover:bg-emerald-500 hover:text-black transition-colors"
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