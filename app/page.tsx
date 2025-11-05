import Link from "next/link";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Produtos</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <li key={p.id} className="border rounded-lg p-4">
            <div className="aspect-square bg-gray-100 rounded-md mb-3" />
            <h2 className="font-medium">{p.name}</h2>
            <p className="text-sm text-gray-500">R$ {p.price.toFixed(2)}</p>
            <Link
              href={`/p/${p.id}`}
              className="mt-2 inline-block px-3 py-2 rounded bg-black text-white"
            >
              Ver
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}