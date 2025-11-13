// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/components/products/data";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="px-4 pt-6 pb-4">
        <div className="mx-auto max-w-3xl rounded-3xl overflow-hidden relative border border-zinc-800">
          <div className="relative h-40 sm:h-56">
            <Image
              src="/banner.jpg"
              alt="Promo relâmpago"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-8 bg-black/35">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Promo relâmpago
            </h1>
            <p className="text-sm sm:text-base text-zinc-200 mb-4 max-w-xs">
              Até 50% OFF em itens selecionados
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#produtos"
                className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium"
              >
                Ver ofertas
              </a>
              <Link
                href="/checkout"
                className="rounded-2xl bg-white/15 px-4 py-2 text-sm font-medium border border-white/40"
              >
                Ir para o checkout
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LISTA DE PRODUTOS */}
      <section id="produtos" className="px-4 pb-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">Produtos</h2>

          <div className="grid gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}