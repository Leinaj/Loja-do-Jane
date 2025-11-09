// app/produto/[slug]/page.tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';

import CartProviderClient from '../../cart-provider'; // 👈 caminho relativo a partir de /produto/[slug]
import { getProduct } from '@/data/products';

type PageProps = { params: { slug: string } };

export default async function Page({ params }: PageProps) {
  const product = getProduct(params.slug);
  if (!product) return notFound();

  return (
    <CartProviderClient>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="rounded-2xl overflow-hidden border border-zinc-800">
          <Image
            src={product.image}
            alt={product.name}
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-zinc-400">{product.description}</p>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-zinc-500 line-through">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(product.oldPrice)}
            </span>
          )}
        </div>

        {/* 
          Se você já tem um componente de adicionar ao carrinho (client) que usa useCart,
          pode importar e renderizar aqui. Exemplo:

          <AddToCart product={product} />

          Caso não tenha, você pode manter só os dados da página; o importante é que,
          quando algum componente usar useCart, o Provider já está ativo aqui.
        */}
      </div>
    </CartProviderClient>
  );
}