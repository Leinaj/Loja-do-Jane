// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white pb-10">
      {/* TÍTULO DA LOJA */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-4">
        <h1 className="text-3xl font-bold mb-1">
          Loja do Jane — Ofertas e Moda
        </h1>
        <p className="text-gray-300">
          Escolha seu produto e clique na foto ou em &quot;Ver&quot; para abrir
          a página de detalhes.
        </p>
      </div>

      {/* LISTA DE PRODUTOS */}
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-black/40 rounded-3xl p-4 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]"
          >
            {/* FOTO CLICÁVEL */}
            <Link
              href={`/produto/${product.slug}`}
              className="block rounded-2xl overflow-hidden mb-4 bg-black/40"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-auto"
              />
            </Link>

            {/* NOME E DESCRIÇÃO */}
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p className="text-gray-300 mt-1">{product.description}</p>

            {/* PREÇOS */}
            <div className="mt-3 flex items-center gap-3">
              <span className="text-green-400 font-bold text-xl">
                {product.priceFormatted}
              </span>
              {product.oldPriceFormatted && (
                <span className="text-gray-500 line-through">
                  {product.oldPriceFormatted}
                </span>
              )}
            </div>

            {/* BOTÃO VER */}
            <div className="mt-4">
              <Link href={`/produto/${product.slug}`}>
                <button className="w-full rounded-full border border-green-400 px-4 py-3 text-center text-green-400 font-semibold shadow-[0_0_25px_rgba(34,197,94,0.65)]">
                  Ver
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}