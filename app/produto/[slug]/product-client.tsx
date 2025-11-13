// app/produto/[slug]/product-client.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/cart/context";
import type { Product } from "@/components/products/data";

type Props = {
  product: Product;
};

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function ProductClient({ product }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  function handleAdd() {
    addItem({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  return (
    <>
      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md pointer-events-none">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl flex gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-emerald-400">
                Produto adicionado ao carrinho
              </span>
              <span className="text-xs text-zinc-400">
                Você pode finalizar a compra na página de checkout.
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr]">
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-zinc-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {product.description && (
            <p className="mt-2 text-zinc-400">{product.description}</p>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-emerald-400">
              R$ {brl(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-zinc-500 line-through">
                R$ {brl(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-3 border border-zinc-700 rounded-full px-3 py-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-800 text-lg"
              >
                -
              </button>
              <span className="w-8 text-center text-lg font-medium">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-800 text-lg"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 rounded-full bg-emerald-500 px-4 py-3 text-base font-semibold text-black hover:bg-emerald-400 transition-colors"
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </>
  );
}