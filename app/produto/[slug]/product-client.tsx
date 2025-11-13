// app/produto/[slug]/product-client.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/components/products/data";
import { useCart } from "@/components/cart/context";

type Props = {
  product: Product;
};

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export function ProductClient({ product }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  function handleAddToCart() {
    addItem({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty, // 👈 agora bate com o tipo CartItem
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  }

  return (
    <>
      <div className="min-h-[70vh] px-4 py-6 md:py-10 flex justify-center">
        <div className="w-full max-w-4xl grid gap-8 md:grid-cols-[1.2fr_1fr]">
          {/* Imagem */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <Image
              src={`/${product.image}`}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          {/* Info */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-zinc-400 text-sm md:text-base">
                {product.description}
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-emerald-400">
                  R$ {brl(product.price)}
                </span>
              </div>
            </div>

            {/* Quantidade */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">Quantidade</span>
              <div className="inline-flex items-center rounded-2xl border border-zinc-700 bg-zinc-900">
                <button
                  type="button"
                  className="px-3 py-2 text-lg"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="w-10 text-center text-base">{qty}</span>
                <button
                  type="button"
                  className="px-3 py-2 text-lg"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-auto inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition"
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md pointer-events-none">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl flex gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-emerald-400">
                Produto adicionado ao carrinho
              </span>
              <span className="text-xs text-zinc-400">
                Você pode finalizar a compra na tela de carrinho.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}