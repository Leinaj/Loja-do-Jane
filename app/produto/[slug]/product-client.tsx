// app/produto/[slug]/product-client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/products";
import { useCart } from "@/contexts/CartContext";

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  const cart = useCart() as any;
  const addToCart = cart?.addToCart ?? (() => {});

  const [quantity, setQuantity] = useState(1);
  const [isPressed, setIsPressed] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => q + 1);

  const priceBRL = product.price.toFixed(2).replace(".", ",");
  const oldPriceBRL = product.oldPrice
    ? product.oldPrice.toFixed(2).replace(".", ",")
    : null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
      {/* BOTÃO IGUAL AO DO CHECKOUT */}
      <Link
        href="/"
        className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition"
      >
        <span className="text-lg">🏠</span>
        <span>Voltar para a loja</span>
      </Link>

      <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
        <div className="relative aspect-[4/3] w-full bg-black/80">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 640px, 100vw"
            className="object-contain"
            priority
          />
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-emerald-500/20" />
        </div>

        <div className="px-6 pb-6 pt-5">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-zinc-300">{product.description}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-emerald-400">
              R$ {priceBRL}
            </span>
            {oldPriceBRL && (
              <span className="text-sm text-zinc-500 line-through">
                R$ {oldPriceBRL}
              </span>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-zinc-300">Quantidade:</p>
              <div className="mt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={decrease}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/60 bg-black/60 text-2xl text-emerald-300 hover:bg-emerald-500/10 active:scale-95 transition"
                >
                  −
                </button>
                <span className="w-6 text-center text-lg">{quantity}</span>
                <button
                  type="button"
                  onClick={increase}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/60 bg-black/60 text-2xl text-emerald-300 hover:bg-emerald-500/10 active:scale-95 transition"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              onClick={handleAddToCart}
              className={`mt-2 flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-black shadow-[0_0_40px_rgba(16,185,129,0.5)] transition ${
                isPressed ? "scale-95" : "hover:bg-emerald-400"
              }`}
            >
              {added ? "Adicionado! ✅" : "Adicionar ao carrinho"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}