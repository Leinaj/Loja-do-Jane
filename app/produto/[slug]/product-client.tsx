// app/produto/[slug]/product-client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

type Props = {
  product: {
    id: number;
    slug: string;
    name: string;
    description?: string;
    price: number;
    oldPrice?: number;
  };
};

export default function ProductClient({ product }: Props) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // --- IMAGEM FIXA PELO SLUG (usando arquivos de /public) ---
  const slugToImage: Record<string, string> = {
    "camiseta-branca": "/camiseta-branca.jpg",
    "camiseta-preta": "/camiseta-preta.jpg",
    "moletom-cinza": "/moletom.jpg",
    "bone-preto": "/bone.jpg",
  };

  const imageSrc = slugToImage[product.slug] ?? "/banner.jpg";

  // --- FORMATAÇÃO DOS PREÇOS ---
  const priceText = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const oldPriceText =
    typeof product.oldPrice === "number"
      ? product.oldPrice.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "";

  function handleAddToCart() {
    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: imageSrc,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="px-4 pb-24 pt-6">
      {/* Botão voltar */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition"
        >
          <span className="mr-2 text-lg">←</span>
          Voltar para a loja
        </Link>
      </div>

      {/* Card do produto */}
      <section className="rounded-3xl bg-gradient-to-b from-emerald-900/20 via-black to-black/90 p-4 shadow-[0_0_40px_rgba(16,185,129,0.25)] mb-8">
        {/* Imagem */}
        <div className="mb-4 overflow-hidden rounded-3xl bg-black/60">
          <Image
            src={imageSrc}
            alt={product.name}
            width={800}
            height={800}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Nome e descrição */}
        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
        {product.description && (
          <p className="text-sm text-zinc-300 mb-4">{product.description}</p>
        )}

        {/* Preços */}
        <div className="mt-2 flex items-baseline gap-2 mb-6">
          <span className="text-3xl font-semibold text-emerald-400">
            {priceText}
          </span>
          {oldPriceText && (
            <span className="text-sm text-zinc-500 line-through">
              {oldPriceText}
            </span>
          )}
        </div>

        {/* Quantidade */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 text-xl hover:bg-zinc-800 active:scale-95 transition"
          >
            –
          </button>
          <span className="w-10 text-center text-lg font-medium">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-700 text-xl hover:bg-zinc-800 active:scale-95 transition"
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
      </section>

      {/* Toast de confirmação */}
      {added && (
        <div className="fixed left-1/2 bottom-6 -translate-x-1/2 bg-emerald-500/90 text-black px-6 py-2 rounded-full text-sm shadow-lg">
          Produto adicionado ao carrinho
        </div>
      )}
    </main>
  );
}