// app/produto/[slug]/page.tsx
import Link from "next/link";
import { products } from "@/components/products/data";
import { ProductClient } from "./product-client";

type Props = {
  params: { slug: string };
};

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 max-w-md text-center">
          <h1 className="text-3xl font-bold mb-2">Produto não encontrado</h1>
          <p className="text-zinc-400 mb-6">
            Este item não existe mais ou o link está incorreto.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return <ProductClient product={product} />;
}