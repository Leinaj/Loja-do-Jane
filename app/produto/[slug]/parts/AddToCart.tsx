"use client";

import { useCart } from "@/components/CartContext";
import type { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <button
      onClick={() => add(product, 1)}
      aria-label={`Adicionar ${product.name} ao carrinho`}
      className="btn"
    >
      Adicionar ao carrinho
    </button>
  );
}