"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

type AnyProduct = {
  id: string;
  name: string;
  price: number;
  slug?: string;
  image?: string;
};

export default function AddToCart({ product }: { product: AnyProduct }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    // Garante que só os campos necessários sejam passados
    add(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        slug: product.slug || "",
        image: product.image || "",
      },
      qty
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="flex items-center gap-2">
        <button className="btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          −
        </button>
        <span className="w-6 text-center">{qty}</span>
        <button className="btn" onClick={() => setQty((q) => q + 1)}>
          +
        </button>
      </div>

      <button
        className="btn primary"
        onClick={handleAdd}
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}