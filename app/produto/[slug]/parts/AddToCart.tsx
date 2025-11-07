// app/produto/[slug]/parts/AddToCart.tsx
"use client";

import { Product } from "@/lib/products";
import { useCart } from "@/components/CartContext";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button
      className="btn"
      onClick={() => add(product, 1)}
      aria-label={`Adicionar ${product.name} ao carrinho`}
    >
      Adicionar ao carrinho
    </button>
  );
}