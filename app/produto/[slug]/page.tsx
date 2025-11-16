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

  // Se o slug não existir na lista de produtos
  if (!product) {
    return (
      <main className="px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-2">404 — Página não encontrada</h1>
        <p className="text-gray-300 mb-6">
          Parece que você foi parar num canto vazio da loja 😅
        </p>
        <button
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
      {/* imagem */}
      <div className="rounded-2xl overflow-hidden mb-4 bg-black/40">
        <Image
          src={product.image}
          alt={product.name}
          width={1000}
          height={1000}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* texto */}
      <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
      <p className="text