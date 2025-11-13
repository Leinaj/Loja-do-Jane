"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/context";

export default function ProductClient({ product }: any) {
  const { addItem } = useCart();

  const [showToast, setShowToast] = useState(false);

  function handleAddToCart() {
    addItem(product);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  return (
    <>
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md pointer-events-none">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl flex gap-3 animate-fade-in-down">
            <div className="flex flex-col">
              <p className="text-white font-semibold">Produto adicionado!</p>
              <p className="text-zinc-400 text-sm">{product.name}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl"
      >
        Adicionar ao Carrinho
      </button>
    </>
  );
}