"use client";

import { useCart } from "@/components/CartContext";

type AddToCartProps = {
  product: {
    id?: string | number;
    slug: string;
    name: string;
    price: number;
    image?: string;
  };
};

export default function AddToCart({ product }: AddToCartProps) {
  const { add } = useCart();

  const handleAdd = () => {
    // força o id a ser string (usa o slug como fallback)
    const safeProduct = {
      id: String(product.id ?? product.slug),
      name: product.name,
      price: product.price,
      slug: product.slug,
      image: product.image ?? "/placeholder.png",
    };

    add(safeProduct, 1);
  };

  return (
    <button
      className="btn"
      onClick={handleAdd}
      aria-label={`Adicionar ${product.name} ao carrinho`}
    >
      Adicionar ao carrinho
    </button>
  );
}