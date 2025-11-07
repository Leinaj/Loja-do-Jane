import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <section className="rounded-2xl p-6 bg-gradient-to-r from-emerald-600 to-emerald-500 text-zinc-50">
        <h1 className="text-3xl font-bold">Promo relâmpago ⚡</h1>
        <p className="text-emerald-50/90">Até 50% OFF em itens selecionados.</p>
      </section>

      <section className="mt-8">
        <h2 className="h2">Produtos</h2>
        <div className="grid sm:grid-cols-2 gap-6 mt-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}