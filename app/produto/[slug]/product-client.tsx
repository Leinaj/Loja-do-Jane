// app/produto/[slug]/product-client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/app/data/products";

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (qty <= 0) return;

    // usa a função nova (ela já soma quantidade lá dentro)
    addToCart(product, qty);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* VOLTAR PARA A LOJA */}
      <div className="mb-4">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          ← Voltar para a loja
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Imagem */}
        <div className="w-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>

        {/* Infos + carrinho */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            {product.description && (
              <p className="text-sm text-zinc-400 mt-2">
                {product.description}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-emerald-400">
              {product.priceFormatted ?? `R$ ${product.price.toFixed(2)}`}
            </span>
            {product.oldPriceFormatted && (
              <span className="text-sm text-zinc-500 line-through">
                {product.oldPriceFormatted}
              </span>
            )}
          </div>

          {/* Quantidade */}
          <div className="mt-4">
            <span className="block text-sm text-zinc-300 mb-1">
              Quantidade:
            </span>
            <div className="inline-flex items-center gap-3 rounded-full border border-zinc-700 px-4 py-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center text-lg"
              >
                −
              </button>
              <span className="w-6 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 rounded-full border border-zinc-600 flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-full bg-emerald-500 text-black font-semibold py-3 shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors"
            >
              Adicionar ao carrinho
            </button>

            <Link
              href="/checkout"
              className="w-full text-center rounded-full border border-emerald-500/70 py-3 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
            >
              Ir para o carrinho
            </Link>

            {added && (
              <p className="text-sm text-emerald-400 text-center">
                Produto adicionado ao carrinho ✅
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}