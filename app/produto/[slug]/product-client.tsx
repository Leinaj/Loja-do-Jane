"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProviderClient";
import type { Product } from "@/components/products/data";

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function ProductClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  function handleAdd() {
    addItem({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2600);
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 p-2 shadow-lg">
        <Image
          src={product.image}
          alt={product.name}
          width={1200}
          height={900}
          className="w-full rounded-2xl object-cover"
          priority
        />
      </div>

      <h1 className="mb-2 text-4xl font-bold">{product.name}</h1>
      <p className="mb-6 text-neutral-300">{product.description}</p>

      <div className="mb-6 text-3xl text-emerald-400">R$ {brl(product.price)}</div>

      <div className="mb-6 flex items-center gap-4">
        <span>Quantidade:</span>
        <button
          className="h-12 w-12 rounded-xl bg-neutral-800 text-2xl"
          onClick={() => setQty((v) => Math.max(1, v - 1))}
        >
          –
        </button>
        <span className="w-10 text-center text-xl">{qty}</span>
        <button
          className="h-12 w-12 rounded-xl bg-neutral-800 text-2xl"
          onClick={() => setQty((v) => v + 1)}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="mb-4 w-full rounded-2xl bg-emerald-600 py-4 text-lg font-semibold text-white hover:bg-emerald-500"
      >
        Adicionar ao carrinho
      </button>

      {/* Toast igual ao print: canto inferior, verde, com botão “Ver carrinho” */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 w-[min(92vw,640px)] rounded-2xl border border-emerald-300/30 bg-emerald-600/90 p-4 text-white backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" />
            <div className="flex-1">
              <div className="font-semibold">Produto adicionado!</div>
              <div className="text-white/90">
                1 × {product.name} foi adicionado ao carrinho.
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="rounded-full px-2 text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="mt-3">
            <a
              href="/checkout"
              className="inline-block rounded-xl border border-white/30 px-4 py-2 text-white hover:bg-white/10"
            >
              Ver carrinho
            </a>
          </div>
        </div>
      )}
    </>
  );
}