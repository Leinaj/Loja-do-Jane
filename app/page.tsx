'use client';

import Image from 'next/image';
import Link from 'next/link';
import { money } from '../lib/format';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number; // opcional
  badge?: string; // opcional
};

const products: Product[] = [
  {
    id: '1',
    name: 'Moletom Cinza',
    image: '/products/moletom-cinza.jpg',
    price: 159.9,
    oldPrice: 189.9,
    badge: 'Promoção',
  },
  {
    id: '2',
    name: 'Boné Street',
    image: '/products/bone-street.jpg',
    price: 79.9,
    oldPrice: 99.9,
    badge: '🔥 Oferta',
  },
  {
    id: '3',
    name: 'Camiseta Preta',
    image: '/products/camiseta-preta.jpg',
    price: 69.9,
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      {/* Banner */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white text-center shadow-md">
        <h1 className="text-3xl font-semibold">Promo relâmpago ⚡</h1>
        <p className="text-lg">Até 50% OFF em itens selecionados.</p>
      </div>

      {/* Produtos */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Produtos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-neutral-900/60 border border-white/10 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform"
            >
              <div className="relative w-full h-64">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
                {p.badge && (
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-md">
                    {p.badge}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-lg font-medium">{p.name}</h3>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold text-lg">
                    {money(p.price)}
                  </span>
                  {p.oldPrice && (
                    <span className="text-white/60 line-through text-sm">
                      {money(p.oldPrice)}
                    </span>
                  )}
                </div>

                <Link
                  href={`/produto/${p.id}`}
                  className="inline-block text-center w-full py-2 mt-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition"
                >
                  Ver produto
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}