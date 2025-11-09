'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';
import Link from 'next/link';

type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCart({ product }: { product: ProductLite }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  // --- Toast leve, no próprio componente ---
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });
    setShowToast(true);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            className="h-12 w-12 rounded-xl bg-neutral-800 text-2xl"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Diminuir"
          >
            –
          </button>
          <div className="h-12 min-w-12 rounded-xl bg-neutral-800 grid place-items-center text-xl">
            {qty}
          </div>
          <button
            className="h-12 w-12 rounded-xl bg-neutral-800 text-2xl"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Aumentar"
          >
            +
          </button>
        </div>

        <button
          className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition font-medium"
          onClick={handleAdd}
        >
          Adicionar ao carrinho
        </button>
      </div>

      {/* Botão secundário “Voltar para a loja” (fica igual ao seu print) */}
      <div className="mt-4">
        <Link
          href="/"
          className="block h-12 rounded-xl border border-emerald-700/40 bg-transparent grid place-items-center"
        >
          Voltar para a loja
        </Link>
      </div>

      {/* TOAST verde translúcido ao estilo do seu print */}
      {showToast && (
        <div className="fixed left-4 right-4 bottom-6 z-50">
          <div className="mx-auto max-w-2xl rounded-2xl bg-emerald-600/90 backdrop-blur px-5 py-4 shadow-lg text-white">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-white" />
              <div className="flex-1 font-medium">Produto adicionado!</div>
              <button
                onClick={() => setShowToast(false)}
                aria-label="Fechar"
                className="opacity-80 hover:opacity-100"
              >
                ×
              </button>
            </div>

            <div className="mt-2 text-white/90">
              1 × {product.name} foi adicionado ao carrinho.
            </div>

            <div className="mt-3">
              <Link
                href="/checkout"
                className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm"
              >
                Ver carrinho
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}