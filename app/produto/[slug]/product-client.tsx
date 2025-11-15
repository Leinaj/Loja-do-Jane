"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../../components/products/data";
import { useCart } from "../../cart-provider";

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  function handleAddToCart() {
    if (qty < 1) return;

    addToCart({
      id: product.slug,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] py-8 sm:py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6 md:flex-row">
          {/* FOTO DO PRODUTO */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 400px, 100vw"
              />
            </div>
          </div>

          {/* INFO / COMPRA */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-emerald-400">
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              {/* QUANTIDADE */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-300">Quantidade:</span>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-20 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-center text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              {/* BOTÕES */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(16,185,129,0.45)] transition hover:bg-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.6)]"
                >
                  Adicionar ao carrinho
                </button>

                <Link
                  href="/"
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
                >
                  Voltar para a loja
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST "PRODUTO ADICIONADO" COM GLOW */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2">
          <div className="pointer-events-none flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-zinc-900/95 px-4 py-3 shadow-[0_0_30px_rgba(16,185,129,0.55)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20">
              <span className="text-lg">✅</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-emerald-400">
                Produto adicionado
              </p>
              <p className="text-xs text-zinc-300">
                <span className="font-medium">{product.name}</span> foi
                adicionado ao carrinho.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}