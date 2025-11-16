// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    price: 49.9,
    oldPrice: 59.9,
    description:
      "Camiseta branca clássica, 100% algodão, perfeita para o dia a dia.",
    image: "/camiseta-branca.jpg",
  },
  {
    id: 2,
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    price: 59.9,
    oldPrice: 79.9,
    description:
      "Camiseta preta básica, caimento confortável e estilo para qualquer ocasião.",
    image: "/camiseta-preta.jpg",
  },
  {
    id: 3,
    slug: "bone",
    name: "Boné",
    price: 39.9,
    oldPrice: 49.9,
    description:
      "Boné preto ajustável, ideal para completar o look com personalidade.",
    image: "/bone.jpg",
  },
  {
    id: 4,
    slug: "moletom",
    name: "Moletom",
    price: 129.9,
    oldPrice: 159.9,
    description:
      "Moletom cinza com capuz, quentinho e estiloso para dias mais frios.",
    image: "/moletom.jpg",
  },
];

export default function HomePage() {
  const { cart } = useCart();
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8">
        <Link href="/" className="text-2xl font-semibold text-emerald-500">
          Loja do Jane
        </Link>

        <Link
          href="/checkout"
          className="flex items-center gap-2 rounded-full border border-emerald-500/70 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/20 transition-colors"
        >
          <span className="text-lg">🛒</span>
          <span>{itemsCount} {itemsCount === 1 ? "item" : "items"}</span>
        </Link>
      </header>

      {/* TÍTULO / SUBTÍTULO */}
      <section className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">
          Loja da Jane — Ofertas e Moda
        </h1>
        <p className="text-zinc-400 text-sm">
          Escolha seu produto e clique na foto ou em &quot;Ver&quot; para abrir
          a página de detalhes.
        </p>
      </section>

      {/* LISTA DE PRODUTOS */}
      <section className="grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col"
          >
            <Link
              href={`/produto/${product.slug}`}
              className="relative w-full aspect-[4/5] bg-black"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </Link>

            <div className="p-5 flex flex-col gap-2 flex-1">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-xs text-zinc-400 mb-2">
                {product.description}
              </p>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-2xl font-semibold text-emerald-400">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-zinc-500 line-through">
                    R$ {product.oldPrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>

              {/* BOTÃO VER COM MESMO ESTILO DO "ADICIONAR AO CARRINHO" */}
              <Link
                href={`/produto/${product.slug}`}
                className="mt-2 w-full rounded-full bg-emerald-500 text-black font-semibold py-3 text-center shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors"
              >
                Ver
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}