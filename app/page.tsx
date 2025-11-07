import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function Home(){
  return (
    <>
      <section className="mb-10">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 p-6 md:p-10 text-black">
          <h1 className="h1">Promo relâmpago ⚡</h1>
          <p className="mt-2 font-medium">Até 50% OFF em itens selecionados.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h2">Produtos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </>
  );
}