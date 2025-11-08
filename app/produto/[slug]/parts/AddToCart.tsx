'use client';

import { useCart } from '@/lib/cart';

export default function AddToCartButton({
  id,
  name,
  price,
  image,
}: {
  id: string;
  name: string;
  price: number;
  image?: string;
}) {
  const { add } = useCart();

  return (
    <button
      onClick={() => add({ id, name, price, image, quantity: 1 })}
      className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700"
    >
      Adicionar ao carrinho
    </button>
  );
}