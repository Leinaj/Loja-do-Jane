import Image from "next/image";
import Link from "next/link";
import { findBySlug, products, formatBRL } from "@/lib/products";

type PageProps = { params: { id: string } };

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.slug }));
}

export default function ProductPage({ params }: PageProps) {
  const product = findBySlug(params.id);

  if (!product) {
    return (
      <main className="min-h-screen max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
        <Link href="/" className="mt-4 inline-block text-emerald-400 hover:underline">
          Voltar para a loja
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-neutral-400 mb-6">
        <Link href="/" className="hover:text-neutral-200">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-200">{product.name}</span>
      </nav>

      <div className="grid sm:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-900">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-emerald-400 text-2xl font-semibold">{formatBRL(product.price)}</p>
          <p className="text-neutral-300 mt-4">{product.description}</p>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => {
                alert("Produto adicionado ao carrinho ✅");
                // aqui você mantém sua lógica de carrinho já existente
              }}
              className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-medium"
            >
              Adicionar ao carrinho
            </button>
            <Link
              href="/"
              className="px-5 py-3 rounded-lg border border-neutral-700 hover:bg-neutral-900"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
