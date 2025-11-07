'use client';

import Image from 'next/image';
import Link from 'next/link';

type Prod = {
  name: string;
  price: number;
  image: string;
  slug?: string;
  description?: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductCard({ product }: { product: Prod }) {
  const slug = product.slug ?? slugify(product.name);

  const addToCart = () => {
    try {
      const cartRaw = typeof window !== 'undefined'
        ? window.localStorage.getItem('cart') : '[]';
      const cart = cartRaw ? JSON.parse(cartRaw) : [];
      cart.push({ ...product, qty: 1, slug });
      window.localStorage.setItem('cart', JSON.stringify(cart));
      alert('Adicionado ao carrinho ✅');
    } catch {}
  };

  return (
    <div className="card p-4">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <h3 className="mt-3 text-xl font-semibold">{product.name}</h3>
      <p className="text-zinc-400">R$ {product.price.toFixed(2)}</p>

      <div className="mt-3 flex gap-2">
        <button onClick={addToCart} className="btn btn-primary">
          Adicionar ao carrinho
        </button>
        <Link href={`/produto/${slug}`} className="btn btn-ghost">
          Ver
        </Link>
      </div>
    </div>
  );
}