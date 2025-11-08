'use client';

import { useCart } from '@/lib/cart';

type Product = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();

  // garante id como string para evitar incompatibilidades
  const safe = {
    id: String(product.id),
    name: product.name,
    price: Number(product.price),
    image: product.image,
    slug: product.slug,
    quantity: 1,
  };

  return (
    <button
      type="button"
      onClick={() => add(safe, 1)}
      className="rounded-full bg-emerald-600 hover:bg-emerald-500 px-5 py-3 font-semibold transition-colors"
      aria-label={`Adicionar ${product.name} ao carrinho`}
    >
      Adicionar ao carrinho
    </button>
  );
}