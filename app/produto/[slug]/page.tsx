// app/produto/[slug]/page.tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct } from '../../data/products';

type PageProps = { params: { slug: string } };

export default async function Page({ params }: PageProps) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="rounded-2xl overflow-hidden border">
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
        <p className="text-muted-foreground">{product.description}</p>
        <p className="text-2xl font-bold">R$ {product.price.toFixed(2)}</p>
      </div>
    </main>
  );
}