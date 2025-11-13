// app/produto/[slug]/page.tsx
import ProductClient from "./product-client";
import { products } from "@/components/products/data";

type Props = {
  params: { slug: string };
};

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold mb-2">Produto não encontrado</h1>
          <p className="text-zinc-400 mb-6">
            Este item não existe mais ou o link está incorreto.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-black hover:bg-emerald-400 transition-colors"
          >
            Voltar para a loja
          </a>
        </div>
      </div>
    );
  }

  return <ProductClient product={product} />;
}