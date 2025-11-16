"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  // Garantimos pro TypeScript que SEMPRE existe um produto válido
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    // Se alguém acessar um slug inválido, só mostra nada (ou você pode criar uma página 404 depois)
    return (
      <div className="px-4 py-10">
        <p className="text-center text-gray-400">
          Produto não encontrado. 😔
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-emerald-500/10 border border-emerald-500/60 text-emerald-300 font-semibold shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 transition"
          >
            <span className="text-lg">←</span>
            <span>Voltar para a loja</span>
          </Link>
        </div>
      </div>
    );
  }

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const priceFormatted = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const oldPriceFormatted =
    product.oldPrice &&
    product.oldPrice.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="px-4 pb-10">
      {/* Topinho da página de produto: só seta de voltar */}
      <div className="flex items-center justify-between pt-4 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-emerald-500/10 border border-emerald-500/60 text-emerald-300 font-semibold shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 transition"
        >
          <span className="text-lg">←</span>
          <span>Voltar</span>
        </Link>
      </div>

      <div className="mt-2 rounded-3xl bg-gradient-to-b from-emerald-500/5 via-black to-black shadow-[0_0_60px_rgba(16,185,129,0.25)] overflow-hidden">
        {/* Foto do produto com feedback ao toque */}
        <div className="bg-black">
          <div className="p-4">
            <div className="overflow-hidden rounded-3xl bg-black/80 shadow-[0_0_50px_rgba(16,185,129,0.45)]">
              <button
                type="button"
                className="block w-full active:scale-[0.97] transition-transform duration-150"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-auto object-contain"
                  priority
                />
              </button>
            </div>
          </div>
        </div>

        {/* Infos do produto */}
        <div className="px-6 pb-6 pt-2">
          <h1 className="text-3xl font-semibold mb-1">{product.name}</h1>
          <p className="text-gray-400 text-sm mb-4">{product.description}</p>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-emerald-400 text-3xl font-bold">
              {priceFormatted}
            </span>
            {oldPriceFormatted && (
              <span className="text-gray-500 line-through">
                {oldPriceFormatted}
              </span>
            )}
          </div>

          {/* Quantidade */}
          <div className="mb-6">
            <span className="block text-gray-300 mb-2">Quantidade:</span>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDecrease}
                className="w-12 h-12 border border-emerald-500/40 rounded-full flex items-center justify-center text-2xl text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 transition"
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <span className="w-8 text-center text-lg">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="w-12 h-12 border border-emerald-500/40 rounded-full flex items-center justify-center text-2xl text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95 transition"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
          </div>

          {/* Badge de “produto adicionado” */}
          {added && (
            <div className="mb-3 flex justify-center">
              <div className="flex items-center gap-2 rounded-full bg-emerald-600/15 border border-emerald-500/60 px-4 py-2 text-sm text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.45)]">
                <span>✅</span>
                <span>Produto adicionado ao carrinho</span>
              </div>
            </div>
          )}

          {/* Botões principais */}
          <div className="space-y-3 mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full rounded-full bg-emerald-500 text-black font-semibold py-3 shadow-[0_0_45px_rgba(16,185,129,0.9)] active:scale-[0.97] transition-transform duration-150"
            >
              Adicionar ao carrinho
            </button>

            <Link
              href="/checkout"
              className="block w-full rounded-full border border-emerald-500/70 text-emerald-300 font-semibold py-3 text-center bg-black/60 shadow-[0_0_35px_rgba(16,185,129,0.4)] active:scale-[0.97] transition-transform duration-150"
            >
              Ir para o carrinho
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}