'use client';

import AddToCart from './AddToCart';

type Product = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ProductView({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      {/* Imagem */}
      <div className="rounded-3xl border border-white/10 bg-black/20 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full rounded-2xl object-cover"
        />
      </div>

      {/* Título / preço / descrição */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-white/70">{product.description}</p>
        <div className="text-3xl font-semibold text-emerald-400">
          {brl(product.price)}
        </div>
      </div>

      {/* Ações */}
      <AddToCart product={product} />
    </div>
  );
}