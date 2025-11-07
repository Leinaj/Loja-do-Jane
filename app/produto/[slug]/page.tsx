import Image from "next/image";
import { notFound } from "next/navigation";
import { products, productBySlug, priceBRL } from "@/lib/products";
import AddToCart from "./parts/AddToCart";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: PageProps) {
  const product = productBySlug(params.slug);

  if (!product) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <header className="mb-6">
        <a href="/" className="btn-outline">
          ← Voltar
        </a>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="rounded-xl border border-zinc-800 w-full h-auto object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-emerald-400 text-xl">{priceBRL(product.price)}</p>
          {product.description && (
            <p className="text-zinc-300">{product.description}</p>
          )}

          <div className="pt-2">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}