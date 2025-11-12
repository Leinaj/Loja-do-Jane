"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/cart/context";

type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

type ProductClientProps = {
  product: Product;
};

export default function ProductClient({ product }: ProductClientProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  function handleAdd() {
    addItem({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty, // 👈 agora atende o tipo do carrinho
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  const priceFormatted = product.price.toFixed(2).replace(".", ",");

  return (
    <div className="max-w-xl mx-auto pb-16">
      {/* Imagem do produto */}
      <div className="rounded-3xl overflow-hidden bg-neutral-900 mb-6">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Infos */}
      <h1 className="text-3xl font-semibold mb-1">{product.name}</h1>
      <p className="text-neutral-400 mb-4">{product.description}</p>

      <div className="text-emerald-400 text-3xl font-semibold mb-6">
        R$ {priceFormatted}
      </div>

      {/* Quantidade */}
      <div className="mb-4">
        <p className="mb-2 text-neutral-300">Quantidade:</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-12 h-12 rounded-2xl border border-neutral-700 flex items-center justify-center text-2xl"
          >
            –
          </button>
          <span className="w-12 text-center text-lg">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-12 h-12 rounded-2xl border border-neutral-700 flex items-center justify-center text-2xl"
          >
            +
          </button>
        </div>
      </div>

      {/* Botões */}
      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={handleAdd}
          className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-base font-medium"
        >
          Adicionar ao carrinho
        </button>

        <Link
          href="/"
          className="w-full rounded-full border border-neutral-700 text-white py-3 text-center text-base font-medium"
        >
          Voltar para a loja
        </Link>
      </div>

      {/* Toast de produto adicionado */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-xl">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl px-4 py-3 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-sm font-semibold text-white">
                Produto adicionado!
              </p>
              <p className="text-xs text-neutral-300">
                {qty} × {product.name} foi adicionado ao carrinho.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-sm text-neutral-400"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}