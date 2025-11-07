// app/produto/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProductBySlug, priceBRL } from "@/lib/products";
import AddToCart from "./parts/AddToCart";

type PageProps = { params: { slug: string } };

export async function generateStaticParams() {
  // Diz ao Next quais páginas de produto devem ser geradas na build
  return products.map(p => ({ slug: p.slug }));
}

// (Opcional) Metadata básica por página
export async function generateMetadata({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: `${product.name} | Loja da Jane`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }]
    }
  };
}

export default function ProductPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="btn btn-ghost">Loja da Jane</Link>
        <Link href="/checkout" className="btn">Checkout</Link>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="rounded-xl w-full h-auto object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <p className="text-lg text-muted-foreground">{priceBRL(product.price)}</p>
          <p className="mt-4 text-sm leading-relaxed">{product.description}</p>

          <div className="mt-6 flex gap-3">
            <AddToCart product={product} />
            <Link href="/" className="btn btn-outline">Voltar</Link>
          </div>
        </div>
      </div>
    </main>
  );
}