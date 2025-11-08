import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products"; // use sua fonte

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container">
        <section className="mb-10 mt-8">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6">
            <h1 className="text-2xl font-bold">Novidades da Jane</h1>
            <p className="mt-1 text-neutral-300">
              Peças selecionadas com preço amigo. Entrega rápida e segura.
            </p>
          </div>
        </section>

        <section className="grid-products">
          {products.map((p: any) => (
            <ProductCard
              key={p.id ?? p.slug}
              product={{
                id: p.id,
                slug: p.slug,
                name: p.name ?? p.title, // aceita os dois
                image: p.image,
                price: p.price ?? p.value ?? 0,
                oldPrice: p.oldPrice,
                badge: p.badge,
              }}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}