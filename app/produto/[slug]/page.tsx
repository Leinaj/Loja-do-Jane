// app/produto/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCart from "./parts/AddToCart";
import { getProductBySlug, priceBRL, type Product } from "@/lib/products";

type PageProps = {
  params: { slug: string };
};

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <a href="/" className="text-sm underline opacity-80 hover:opacity-100">
          Loja da Jane
        </a>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden bg-neutral-900">
          <Image
            src={product.image}
            alt={product.title}
            width={900}
            height={700}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          <p className="text-3xl font-bold">{priceBRL(product.price)}</p>
          <p className="opacity-80">{product.description}</p>

          <div className="pt-4">
            <AddToCart product={product as Product} />
          </div>
        </div>
      </div>
    </main>
  );
}