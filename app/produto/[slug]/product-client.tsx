// app/produto/[slug]/product-client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    // Aqui já recebemos um product garantido (não é undefined)
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="px-4 pb-24 pt-6">
      {/* Voltar para loja */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-4"
      >
        <span className="mr-1">←</span>
        Voltar para loja
      </Link>

      {/* Imagem do produto */}
      <div className="rounded-2xl overflow-hidden mb-4 bg-black/40">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Nome e descrição */}
      <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

      {product.description && (
        <p className="text-sm text-zinc-300 mb-4">{product.description}</p>
      )}

      {/* Preço */}
      <div className="mt-2 flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-semibold text-emerald-400">
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>

      {/* Quantidade */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-700 text-lg hover:bg-zinc-800 active:scale-95 transition"
        >
          –
        </button>
        <span className="w-10 text-center text-lg font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-700 text-lg hover:bg-zinc-800 active:scale-95 transition"
        >
          +
        </button>
      </div>

      {/* Botões */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full rounded-full bg-emerald-500 text-black font-semibold py-3 text-sm uppercase tracking-wide hover:bg-emerald-400 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          Adicionar ao carrinho
        </button>

        <Link
          href="/checkout"
          className="w-full rounded-full border border-emerald-500 text-emerald-400 font-semibold py-3 text-sm uppercase tracking-wide text-center hover:bg-emerald-500 hover:text-black active:scale-[0.98] transition"
        >
          Ir para o carrinho
        </Link>
      </div>

      {/* Toast de confirmação */}
      {added && (
        <div className="fixed left-1/2 bottom-6 -translate-x-1/2 bg-emerald-500/90 text-black px-6 py-2 rounded-full text-sm shadow-lg">
          Produto adicionado ao carrinho
        </div>
      )}
    </main>
  );
}