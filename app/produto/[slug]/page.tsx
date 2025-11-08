'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

// ajuste os caminhos de acordo com seu projeto
import { useCart } from '@/lib/cart';
import { money } from '@/lib/money';
import { products } from '@/lib/products';

// Tipagem simples do produto (compatível com o que já existe)
type Product = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;      // ex: "moletom.jpg"
  badge?: string;
  description?: string;
};

type PageProps = {
  params: { slug: string };
};

export default function ProductPage({ params }: PageProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const product = useMemo<Product | undefined>(() => {
    // tenta achar por slug; se no seu lib/products não tiver slug,
    // adapte para buscar por id ou name.
    const p = (products as Product[]).find((it) => it.slug === params.slug);
    return p;
  }, [params.slug]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-white">Produto não encontrado</h1>
        <p className="mt-2 text-neutral-300">
          O item que você procura não está disponível.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    // ✅ corrige o erro: força id do carrinho como string
    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAdded(true);

    // dispara um evento global (se você quiser ouvir em outro lugar)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cart:item-added', { detail: { name: product.name } })
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-16">
      {/* alerta de sucesso (não redireciona) */}
      {added && (
        <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-600/10 px-4 py-3 text-emerald-200">
          <div className="flex items-center justify-between gap-4">
            <span>✅ <strong>{product.name}</strong> foi adicionado ao carrinho.</span>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-md bg-transparent px-3 py-1.5 text-emerald-300 underline hover:text-emerald-200"
              >
                Voltar para a loja
              </Link>
              <Link
                href="/checkout"
                className="rounded-md bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-500 transition-colors"
              >
                Ir para o checkout
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Imagem do produto (usa /public) */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          {/* Se suas imagens estão em /public com nomes ex: moletom.jpg */}
          <img
            src={`/${product.image}`}
            alt={product.name}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* Detalhes */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            {product.badge && (
              <span className="mt-2 inline-block rounded-full bg-emerald-600/20 px-3 py-1 text-sm text-emerald-300">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-emerald-400">
              {money(product.price)}
            </span>
            {typeof product.oldPrice === 'number' && (
              <span className="text-lg text-neutral-400 line-through">
                {money(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="text-neutral-300">
            {product.description ?? 'Produto de ótima qualidade, pronto para envio.'}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAdd}
              className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-500 transition-colors"
            >
              Adicionar ao carrinho
            </button>

            <Link
              href="/"
              className="rounded-lg border border-white/15 px-5 py-3 font-medium text-white/90 hover:bg-white/5 transition-colors"
            >
              Voltar
            </Link>
          </div>

          <div className="pt-4 text-sm text-neutral-400">
            Frete calculado no checkout. Entrega rápida para todo o Brasil.
          </div>
        </div>
      </div>
    </div>
  );
}