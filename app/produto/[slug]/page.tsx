// app/produto/[slug]/page.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { products } from '@/lib/products';
import { useCart } from '@/lib/cart';

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);
  const { add } = useCart();
  const router = useRouter();

  if (!product) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-white/70">Produto não encontrado.</p>
      </main>
    );
  }

  const handleAdd = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    router.push('/checkout');
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2">
      <div className="relative w-full aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-xl"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-white/80">{product.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold text-2xl">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {product.oldPrice ? (
            <span className="text-white/50 line-through">
              R$ {product.oldPrice.toFixed(2).replace('.', ',')}
            </span>
          ) : null}
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition px-5 py-3 font-medium"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </main>
  );
}