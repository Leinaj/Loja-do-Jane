import Link from "next/link";
import { getProductById } from "@/lib/products";

type Props = { params: { id: string } };

export default function ProductPage({ params }: Props) {
  const product = getProductById(params.id);

  if (!product) {
    return (
      <main className="max-w-3xl mx-auto p-4">
        <p className="mb-4">Produto não encontrado</p>
        <Link
          href="/"
          className="inline-block px-3 py-2 bg-black text-white rounded"
        >
          Voltar
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-4">R$ {product.price.toFixed(2)}</p>

      <form action="/api/cart" method="post">
        <input type="hidden" name="id" value={product.id} />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          type="submit"
        >
          Adicionar ao carrinho
        </button>
      </form>

      <div className="mt-4">
        <Link href="/" className="text-sm underline">
          Voltar para a loja
        </Link>
      </div>
    </main>
  );
}