// app/page.tsx
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <h2 className="text-3xl font-bold">Promo relâmpago ⚡</h2>
        <p className="opacity-90">Até 50% OFF em itens selecionados.</p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">Produtos</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </main>
  );
}