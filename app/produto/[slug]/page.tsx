// app/produto/[slug]/page.tsx

import ProductClient from "./product-client";
import { products, type Product } from "../../data/products";

type PageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: PageProps) {
  const product = products.find((p: Product) => p.slug === params.slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Produto não encontrado.</p>
      </main>
    );
  }

  return <ProductClient product={product} />;
}