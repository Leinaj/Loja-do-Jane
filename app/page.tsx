"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function HomePage() {
  return (
    <main className="px-4 pb-20 pt-6">
      <h1 className="text-2xl font-bold mb-2">Loja do Jane — Ofertas e Moda</h1>
      <p className="text-gray-300 mb-6">
        Escolha seu produto e clique na foto ou em "Ver" para abrir a página de detalhes.
      </p>

      <div className="grid grid-cols-1 gap-6">
        {products.map((product) => (
          <div
            key={product.slug}
            className="bg-black/40 p-4 rounded-2xl border border-white/10 shadow-lg"
          >
            {/* IMAGEM DO PRODUTO */}
            <div className="rounded-xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-auto object-cover"
              />
            </div>

            <h2 className="text-xl font-semibold mt-3">{product.name}</h2>
            <p className="text-gray-400 text-sm">{product.description}</p>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-green-400 font-bold text-xl">
                {formatPrice(product.price)}
              </span>

              {product.oldPrice && (
                <span className="text-gray-500 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            <Link
              href={`/produto/${product.slug}`}
              className="mt-4 block w-full text-center py-3 rounded-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all font-medium shadow-[0_0_10px_rgba(0,255,128,0.3)]"
            >
              Ver
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}