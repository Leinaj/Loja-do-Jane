import { products } from "@/components/products/data";
import { CartProviderClient } from "@/components/cart/CartProviderClient";
import ProductDetails from "@/components/products/ProductDetails";

export default async function Page({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
        <h1 className="text-3xl font-bold mb-4">404 — Produto não encontrado</h1>
        <p className="mb-6">Parece que este item não está mais disponível 😅</p>
        <a
          href="/"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          Voltar para a loja
        </a>
      </div>
    );
  }

  return (
    <CartProviderClient>
      <ProductDetails product={product} />
    </CartProviderClient>
  );
}