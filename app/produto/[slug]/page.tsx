"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.slug === params.slug);

  // Se não achar o produto, mostra 404 bonitinho
  if (!product) {
    return (
      <main className="px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-2">404 — Página não encontrada</h1>
        <p className="text-gray-300 mb-6">
          Parece que você foi parar num canto vazio da loja 😅
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all"
        >
          Voltar para a loja
        </button>
      </main>
    );
  }

  function handleAddToCart() {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="px-4 pb-20 pt-6">
      {/* Imagem do produto */}
      <div className="rounded-2xl overflow-hidden mb-4 bg-black/40">
        <Image
          src={product.image}
          alt={product.name}
          width={1000}
          height={1000}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Infos do produto */}
      <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
      <p className="text-gray-300 mb-4">{product.description}</p>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-green-400 font-bold text-2xl">
          {formatPrice(product.price)}
        </span>
        {product.oldPrice && (
          <span className="text-gray-500 line-through">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>

      {/* Quantidade */}
      <div className="mb-4">
        <span className="block mb-2">Quantidade:</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-full border border-gray-500 flex items-center justify-center text-xl"
          >
            −
          </button>
          <span className="w-8 text-center text-lg">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-full border border-emerald-500 flex items-center justify-center text-xl"
          >
            +
          </button>
        </div>
      </div>

      {/* Botões */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full py-3 rounded-full bg-emerald-500 text-black font-semibold text-center shadow-[0_0_15px_rgba(16,185,129,0.6)] mb-3"
      >
        Adicionar ao carrinho
      </button>

      <button
        type="button"
        onClick={() => router.push("/checkout")}
        className="w-full py-3 rounded-full border border-emerald-500 text-emerald-400 font-semibold text-center"
      >
        Ir para o carrinho
      </button>

      {added && (
        <p className="mt-3 text-center text-sm text-emerald-400">
          Produto adicionado ao carrinho ✅
        </p>
      )}
    </main>
  );
}