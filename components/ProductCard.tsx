import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/components/products/data';

type Props = { product: Product };

export default function ProductCard({ product: p }: Props) {
  return (
    <div className="rounded-2xl bg-neutral-900 border border-white/10 p-4 shadow-lg">
      {/* Imagem do produto */}
      <div className="relative w-full h-52 overflow-hidden rounded-2xl bg-neutral-800">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 600px"
          priority
        />
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-xl font-semibold">{p.name}</h3>
        <div className="flex items-baseline gap-3">
          <span className="text-emerald-400 text-2xl font-bold">
            R$ {p.price.toFixed(2).replace('.', ',')}
          </span>
          {p.compareAtPrice && (
            <span className="line-through opacity-60">
              R$ {p.compareAtPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
      </div>

      <Link
        href={`/produto/${p.slug}`}
        className="mt-4 block w-full text-center rounded-full bg-emerald-600 text-white py-3"
      >
        Ver produto
      </Link>
    </div>
  );
}