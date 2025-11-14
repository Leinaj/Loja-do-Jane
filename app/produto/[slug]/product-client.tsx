"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "../../../components/products/data";
import { useCart } from "../../contexts/CartContext";

type Props = {
  product: Product;
};

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function ProductClient({ product }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  function handleAddToCart() {
    // adiciona ao carrinho
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      qty
    );

    // mostra mensagem "produto adicionado"
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2300);
  }

  const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));
  const increase = () => setQty((q) => q + 1);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto px-4 pb-10">
        {/* IMAGEM DO PRODUTO */}
        <div className="mt-4 rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800">
          <Image
            src={product.image}
            alt={product.name}
            width={1200}
            height={900}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* TÍTULO E DESCRIÇÃO */}
        <h1 className="mt-6 text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-zinc-300">{product.description}</p>

        {/* PREÇO */}
        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-3xl text-emerald-400">
            R$ {brl(product.price)}
          </span>
          {typeof product.oldPrice === "number" && (
            <span className="text-zinc-500 line-through opacity-70">
              R$ {brl(product.oldPrice)}
            </span>
          )}
        </div>

        {/* QUANTIDADE */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-zinc-300">Quantidade:</span>
          <div className="flex items-center rounded-full border border-zinc-700 overflow-hidden">
            <button
              type="button"
              onClick={decrease}
              className="px-4 py-2 text-lg disabled:opacity-40"
              disabled={qty === 1}
            >
              –
            </button>
            <span className="px-4 py-2 text-lg border-x border-zinc-700">
              {qty}
            </span>
            <button
              type="button"
              onClick={increase}
              className="px-4 py-2 text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-full bg-emerald-500 py-3 text-center font-semibold"
          >
            Adicionar ao carrinho
          </button>

          <Link
            href="/checkout"
            className="w-full rounded-full border border-emerald-500 py-3 text-center font-semibold text-emerald-400"
          >
            Ir para o carrinho
          </Link>

          <Link
            href="/"
            className="w-full rounded-full border border-zinc-700 py-3 text-center font-semibold text-zinc-200"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>

      {/* TOAST "PRODUTO ADICIONADO" MEIO TRANSPARENTE */}
      {showToast && (
        <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
          <div className="pointer-events-none rounded-3xl bg-black/70 border border-emerald-500/40 px-4 py-3 shadow-xl backdrop-blur-sm">
            <p className="text-sm font-semibold text-emerald-400 text-center">
              Produto adicionado ao carrinho
            </p>
          </div>
        </div>
      )}
    </div>
  );
}