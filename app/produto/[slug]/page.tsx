'use client';

import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/components/products/data';
import { useCart } from '@/components/cart/context';

type PageProps = {
  params: { slug: string };
};

export default function ProductPage({ params }: PageProps) {
  const { addItem } = useCart();
  const product = products.find((p) => p.slug === params.slug);

  function handleAdd() {
    // Garantia para o TypeScript e para runtime
    if (!product) return;

    addItem({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <h1 className="mb-3 text-3xl font-bold">Produto não encontrado</h1>
          <p className="mb-6 text-zinc-400">
            Parece que este item não existe mais.
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
          >
            Voltar para a loja
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-black/40">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="mt-2 text-zinc-400">{product.description}</p>

          <div className="mt-6 text-3xl font-semibold text-emerald-400">
            {product.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
            >
              Adicionar ao carrinho
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-6 py-3 font-medium text-zinc-200 hover:bg-zinc-800"
            >
              Voltar para a loja
            </Link>
          </div>

          <div className="mt-8 border-t border-zinc-800 pt-6 text-sm text-zinc-400">
            <p>• Algodão 100% macio</p>
            <p>• Envio em 5–8 dias</p>
            <p>• Troca fácil em até 7 dias</p>
          </div>
        </div>
      </div>
    </main>
  );
}