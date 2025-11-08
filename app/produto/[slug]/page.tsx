import Link from 'next/link';
import AddToCartButton from './parts/AddToCart';

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
    image: '/images/moletom-cinza.jpg', // troque para o caminho que você usa
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

function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProduct(params.slug);

  if (!product) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
        <Link className="text-emerald-500 underline" href="/">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Imagem */}
      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
        {/* se suas imagens são externas e o Next/Image reclama, use <img> simples */}
        <img
          src={product.image}
          alt={product.name}
          className="h-auto w-full rounded-lg object-cover"
        />
      </div>

      {/* Info */}
      <div className="space-y-4">
        {product.badge ? (
          <span className="inline-flex w-auto rounded-full bg-emerald-600/90 px-3 py-1 text-sm text-white">
            {product.badge}
          </span>
        ) : null}
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-emerald-400">
            R$ {product.price.toFixed(2)}
          </span>
          {product.oldPrice ? (
            <span className="text-lg text-white/50 line-through">
              R$ {product.oldPrice.toFixed(2)}
            </span>
          ) : null}
        </div>

        <AddToCartButton
          id={product.slug}
          name={product.name}
          price={product.price}
          image={product.image}
        />

        <p className="text-white/70">
          Frete rápido e devolução grátis em 7 dias. Qualquer dúvida, fale conosco no WhatsApp.
        </p>
      </div>
    </div>
  );
}