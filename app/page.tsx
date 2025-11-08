import Banner from '@/components/Banner';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/products';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Banner />

      <h2 id="produtos" className="mt-8 text-2xl font-semibold">
        Produtos
      </h2>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {products.map((p) => (
          <article
            key={p.slug}
            className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-4"
          >
            <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-800">
              <Link href={`/produto/${p.slug}`} title={p.name}>
                <Image
                  src={p.image} // ex.: '/moletom.jpg'
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={p.slug === products[0].slug}
                />
              </Link>
            </div>

            <h3 className="text-lg font-medium">{p.name}</h3>

            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-emerald-400 text-xl font-semibold">
                R$ {p.price.toFixed(2).replace('.', ',')}
              </span>
              {p.oldPrice && (
                <span className="text-white/50 line-through">
                  R$ {p.oldPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            <div className="mt-4">
              <Link
                href={`/produto/${p.slug}`}
                className="block rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-500"
              >
                Ver produto
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}