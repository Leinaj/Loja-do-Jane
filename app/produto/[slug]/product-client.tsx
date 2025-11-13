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
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
      {/* IMAGEM GRANDONA */}
      <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 400px, 100vw"
        />
      </div>

      {/* INFO */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {product.name}
          </h1>
          <p className="mt-2 text-zinc-400">{product.description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl text-emerald-400">
              R$ {brl(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-neutral-400 line-through opacity-60">
                R$ {brl(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 text-white font-semibold px-6 py-3"
          >
            Adicionar ao carrinho
          </button>

          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-2xl border border-emerald-500 text-emerald-400 font-semibold px-6 py-3"
          >
            Ir para o carrinho
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 text-zinc-200 font-medium px-6 py-3"
          >
            Voltar para a loja
          </Link>
        </div>

        {added && (
          <p className="text-sm text-emerald-400">
            Produto adicionado ao carrinho.
          </p>
        )}
      </div>
    </div>
  );
}