'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/components/products/data';
import { useCart } from '@/components/cart/context';

export default function ProductClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  function addToCart() {
    // O tipo AddItemInput não possui "quantity".
    // Adiciona a mesma linha 'qty' vezes.
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* imagem grande */}
      <div className="relative w-full h-80 overflow-hidden rounded-3xl bg-neutral-800">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>

      <section className="rounded-3xl bg-neutral-900 border border-white/10 p-6 shadow-lg space-y-2">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="opacity-80">{product.description}</p>
        <div className="text-3xl text-emerald-400 font-extrabold">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </div>

        {/* quantidade */}
        <div className="mt-3">
          <span className="block text-sm opacity-80 mb-2">Quantidade:</span>
          <div className="inline-flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-xl border border-white/10"
            >
              −
            </button>
            <span className="w-10 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 rounded-xl border border-white/10"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={addToCart}
          className="mt-4 w-full rounded-full bg-emerald-600 text-white py-3 text-lg"
        >
          Adicionar ao carrinho
        </button>

        <Link
          href="/"
          className="mt-3 block w-full rounded-full border border-white/15 py-3 text-center"
        >
          Voltar para a loja
        </Link>
      </section>

      {/* TOAST */}
      {showToast && (
        <div className="fixed left-4 right-4 bottom-6 z-50">
          <div className="mx-auto max-w-xl rounded-2xl bg-neutral-900 border border-emerald-600/40 p-4 shadow-xl">
            <div className="text-emerald-400 font-semibold">Produto adicionado!</div>
            <div className="text-sm opacity-80">
              {qty} × {product.name} foi adicionado ao carrinho.
            </div>
            <Link
              href="/checkout"
              className="mt-2 inline-block rounded-full border border-white/15 px-3 py-1 text-sm"
            >
              Ver carrinho
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}