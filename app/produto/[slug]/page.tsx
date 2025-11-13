// app/produto/[slug]/page.tsx
import Link from "next/link";
import { products } from "@/components/products/data";
import ProductClient from "./product-client";

type Props = {
  params: { slug: string };
};

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Produto não encontrado
        </h1>
        <p className="text-zinc-400 mb-6">
          Este item não existe mais ou o link está incorreto.
        </p>
        <Link
          href="/"
          className="rounded-2xl bg-emerald-500 text-white px-6 py-3 font-medium"
        >
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return <ProductClient product={product} />;
}