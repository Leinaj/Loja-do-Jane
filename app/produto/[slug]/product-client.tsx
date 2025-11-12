"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  description: string;
  details: string[];
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
      quantity: qty, // 👈 obrigatório pro tipo do carrinho
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-8 flex flex-col gap-8">
      {/* FOTO DO PRODUTO */}
      <div className="mx-auto max-w-md w-full rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* CARD DE DETALHES */}
      <div className="mx-auto w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-neutral-300 text-sm">{product.description}</p>
        </div>

        <div className="text-emerald-400 text-3xl font-semibold">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </div>

        {/* QUANTIDADE */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-neutral-300">Quantidade:</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-xl"
            >
              -
            </button>
            <span className="w-8 text-center text-lg">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-full bg-emerald-500 text-neutral-950 py-3 font-medium hover:bg-emerald-400 transition"
          >
            Adicionar ao carrinho
          </button>

          <Link
            href="/"
            className="w-full rounded-full border border-neutral-600 text-white py-3 text-center hover:bg-neutral-800 transition"
          >
            Voltar para a loja
          </Link>
        </div>

        {/* DETALHES / BULLETS */}
        {product.details?.length > 0 && (
          <ul className="mt-2 text-sm text-neutral-300 space-y-1">
            {product.details.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* TOAST "PRODUTO ADICIONADO" */}
      {showToast && (
        <div className="fixed left-1/2 bottom-6 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-2xl bg-neutral-900/95 border border-emerald-500/60 px-4 py-3 shadow-lg shadow-emerald-500/25">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Produto adicionado!</p>
              <p className="text-xs text-neutral-300">
                {qty} × {product.name} foi adicionado ao carrinho.
              </p>
              <div className="mt-3">
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-500 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition"
                >
                  Ver carrinho
                </Link>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="ml-2 text-neutral-400 hover:text-neutral-200 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}