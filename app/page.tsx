import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 text-white">
      {/* Topo */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Loja da Jane</h1>

        <nav className="flex items-center gap-3">
          <Link
            href="/checkout"
            className="bg-emerald-500 hover:bg-emerald-600 transition rounded-xl px-4 py-2 font-semibold text-black"
          >
            Checkout
          </Link>
        </nav>
      </header>

      {/* Banner */}
      <section className="rounded-2xl p-6 mb-8 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black">
        <h2 className="text-3xl font-extrabold">Promo relâmpago ⚡</h2>
        <p className="opacity-80 mt-1">Até 50% OFF em itens selecionados.</p>
      </section>

      {/* Lista de produtos */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Produtos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            // use a chave existente: slug
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <footer className="text-center opacity-70 mt-10">
        © {new Date().getFullYear()} Loja da Jane — feito com amor 💚
      </footer>
    </main>
  );
}