// app/produto/[slug]/parts/AddToCart.tsx
"use client";

import { useCart } from "@/components/CartContext";
import type { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <button
      onClick={() => add(product, 1)}
      className="px-5 py-3 rounded-xl bg-emerald-500 text-black font-medium hover:brightness-110 active:scale-[0.98] transition"
    >
      Adicionar ao carrinho
    </button>
  );
}