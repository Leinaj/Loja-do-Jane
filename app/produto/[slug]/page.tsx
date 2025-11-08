import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import AddToCartButton from './parts/AddToCart';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const revalidate = 0; // mostra mudanças sem cache estático

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-lg text-white/80">
            {product.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>

          {product.description ? (
            <p className="mt-4 text-white/70 leading-relaxed">
              {product.description}
            </p>
          ) : null}

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="text-sm text-white/70 hover:text-white underline underline-offset-4"
            >
              ← Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}