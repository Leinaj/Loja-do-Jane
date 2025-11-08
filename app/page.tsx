import Link from 'next/link';

type Product = {
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
};

const products: Product[] = [
  {
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    price: 159.9,
    oldPrice: 189.9,
    image: '/images/moletom-cinza.jpg',
    badge: 'Promoção ⚡',
  },
  {
    slug: 'bone-street',
    name: 'Boné Street',
    price: 79.9,
    image: '/images/bone-street.jpg',
    badge: 'Oferta 🔥',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg">
        <h2 className="mb-1 text-3xl font-bold">Promo relâmpago ⚡</h2>
        <p className="text-white/90">Até 50% OFF em itens selecionados.</p>
      </div>

      <h3 className="mb-4 text-2xl font-semibold">Produtos</h3>

      <div className="grid gap-6 md:grid-cols-2">
        {products.map((p) => (
          <div
            key={p.slug}
            className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-md"
          >
            <Link href={`/produto/${p.slug}`} className="block">
              <div className="overflow-hidden rounded-xl">
                <img src={p.image} alt={p.name} className="w-full object-cover" />
              </div>
            </Link>

            <div className="mt-4 space-y-2">
              {p.badge ? (
                <span className="inline-flex rounded-full bg-emerald-600/90 px-3 py-1 text-xs text-white">
                  {p.badge}
                </span>
              ) : null}
              <h4 className="text-lg font-medium">{p.name}</h4>
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-semibold text-emerald-400">
                  R$ {p.price.toFixed(2)}
                </span>
                {p.oldPrice ? (
                  <span className="text-sm text-white/50 line-through">
                    R$ {p.oldPrice.toFixed(2)}
                  </span>
                ) : null}
              </div>

              <div className="pt-2">
                <Link
                  href={`/produto/${p.slug}`}
                  className="inline-flex w-full justify-center rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700"
                >
                  Ver produto
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}