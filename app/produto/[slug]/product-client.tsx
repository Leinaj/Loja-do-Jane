// app/produto/[slug]/product-client.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/components/products/data";

type Props = {
  product: Product;
};

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function ProductClient({ product }: Props) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  function handleAddToCart() {
    addToCart({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 pb-10 pt-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* IMAGEM DO PRODUTO */}
        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* INFO */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-zinc-300">{product.description}</p>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl text-emerald-400">
              R$ {brl(product.price)}
            </span>
            {typeof product.oldPrice === "number" && (
              <span className="text-lg text-zinc-500 line-through">
                R$ {brl(product.oldPrice)}
              </span>
            )}
          </div>

          {/* QUANTIDADE */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-zinc-300">Quantidade:</span>
            <div className="inline-flex items-center rounded-full border border-zinc-700">
              <button
                type="button"
                className="px-3 py-1 text-lg"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                –
              </button>
              <span className="px-4 text-sm">{qty}</span>
              <button
                type="button"
                className="px-3 py-1 text-lg"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* BOTÕES */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-emerald-500 py-3 text-center font-semibold"
            >
              Adicionar ao carrinho
            </button>
            <Link
              href="/checkout"
              className="flex-1 rounded-full border border-emerald-500 py-3 text-center text-emerald-400 font-semibold"
            >
              Ir para o carrinho
            </Link>
            <Link
              href="/"
              className="flex-1 rounded-full border border-zinc-600 py-3 text-center text-zinc-200 font-semibold"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>

      {/* TOAST - PRODUTO ADICIONADO */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md pointer-events-none">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl flex gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-emerald-400">
                Produto adicionado
              </span>
              <span className="text-xs text-zinc-300">
                {product.name} foi colocado no seu carrinho.
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}