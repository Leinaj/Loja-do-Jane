import Banner from "@/components/Banner";
import Features from "@/components/Features";
import ProductCard from "@/components/ProductCard";
import Pix from "@/components/Pix";
import { products } from "@/lib/products";

export default function Page() {
  return (
    <>
      <Banner />
      <Features />
      <section id="produtos" className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="mb-4 text-2xl font-bold">Produtos</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} onAdd={() => alert("Item adicionado!")} />
          ))}
        </div>
      </section>
      <section id="contato" className="mx-auto mt-10 max-w-6xl px-4">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-2xl font-bold">Pagamento & Contato</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-400">WhatsApp</p>
              <a className="text-emerald-400 underline" href="https://wa.me/5544988606483" target="_blank">
                +55 (44) 98860-6483
              </a>
            </div>
            <Pix />
            <p className="text-zinc-400">Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.</p>
          </div>
        </div>
      </section>
    </>
  );
}