'use client';

import { useCart } from '@/lib/cart';

export default function AddToCartButton({
  product,
}: {
  product: {
    id: string | number;
    slug: string;
    name: string;
    price: number;
    image?: string;
  };
}) {
  const { add } = useCart();

  const onAdd = () => {
    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });

    // Dispara evento global para mostrar aviso
    window.dispatchEvent(
      new CustomEvent('cart:item-added', { detail: { name: product.name } })
    );
  };

  return (
    <button
      onClick={onAdd}
      className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
    >
      Adicionar ao carrinho
    </button>
  );
}