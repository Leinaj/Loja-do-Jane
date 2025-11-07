"use client";

import { useCart } from "@/components/CartContext";

// Tipagem direta e tolerante, pra evitar erro de compilação
type Product = {
  id?: string | number;
  slug: string;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();

  const handleAdd = () => {
    // Garante que sempre haverá um id (mesmo se faltar no objeto original)
    const safeProduct = {
      id: product.id ?? product.slug,
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