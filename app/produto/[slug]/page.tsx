'use client';

import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

// ajuste esse import para o caminho REAL do seu contexto:
import { useCart } from "@/components/cart/context"; 

type Props = {
  params: { slug: string };
};

export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.slug === params.slug);
  const { addItem } = useCart(); // usa seu provider existente

  if (!product) {
    return (
      <div className="p-6 min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-semibold">Produto não encontrado</h1>
        <Link href="/" className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  function handleAdd() {
    // estrutura mínima esperada pelo seu carrinho
    addItem({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/" className="text-emerald-500 hover:underline">&larr; Voltar para a loja</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
          {/* Se sua imagem não estiver na pasta public, troque o src pelo caminho correto */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-zinc-400">{product.description}</p>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-emerald-400">
              {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
            {product.oldPrice && (
              <span className="text-zinc-500 line-through">
                {product.oldPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAdd}
              className="px-5 py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              Adicionar ao carrinho
            </button>

            <Link
              href="/checkout"
              className="px-5 py-3 rounded-md border border-zinc-700 hover:bg-zinc-800 font-medium"
            >
              Ir para o checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}