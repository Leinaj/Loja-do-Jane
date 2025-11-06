import Image from "next/image";
import Link from "next/link";
import Badges from "@/components/Badges";
import BrandGrid from "@/components/BrandGrid";
import ProductCard from "@/components/ProductCard";
import PixCopy from "@/components/PixCopy";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Barra superior igual ao antigo */}
      <header className="mb-6 flex items-center justify-between">
        <div className="text-xl font-semibold">Loja da Jane</div>
        <nav className="hidden gap-6 sm:flex">
          <Link href="#produtos" className="text-zinc-300 hover:text-white">Catálogo</Link>
          <Link href="#contato" className="text-zinc-300 hover:text-white">Contato</Link>
        </nav>
        <a
          href="https://wa.me/5544988606483"
          target="_blank"
          className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500"
        >
          WhatsApp
        </a>
      </header>

      {/* Banner (como antes) — mantém altura “natural” para não ocupar a tela toda */}
      <section className="mb-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <Image
            src="/banner.jpg"               // troque pela sua imagem
            alt="SALE"
            width={1200}
            height={480}
            sizes="(max-width: 640px) 100vw, 1200px"
            className="h-auto w-full"
            priority
          />
        </div>
      </section>

      {/* Benefícios */}
      <section className="mb-6">
        <Badges />
      </section>

      {/* Marcas (remova se não tiver as logos) */}
      <section className="mb-8">
        <BrandGrid />
      </section>

      {/* Produtos */}
      <section id="produtos" className="mb-10">
        <h2 className="mb-4 text-3xl font-bold">Produtos</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              title={p.title}
              price={p.price}
              image={p.image}
              href={`/produto/${p.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Pagamento & Contato */}
      <section
        id="contato"
        className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <h2 className="mb-4 text-2xl font-semibold">Pagamento & Contato</h2>

        <div className="mb-4">
          <p className="mb-1 text-sm text-zinc-400">WhatsApp</p>
          <a
            href="https://wa.me/5544988606483"
            target="_blank"
            className="inline-block border-b-2 border-emerald-500 pb-0.5 text-lg font-medium text-emerald-400"
          >
            +55 (44) 98860-6483
          </a>
        </div>

        <div className="mb-2">
          <p className="mb-2 text-sm text-zinc-400">Chave PIX</p>
          <PixCopy pix="44988606483" />
        </div>

        <p className="mt-3 text-zinc-400">
          Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
        </p>
      </section>

      <footer className="mx-auto mt-8 max-w-6xl px-2 py-8 text-center text-zinc-400">
        © 2025 Loja da Jane — feito com amor 💚
      </footer>
    </main>
  );
}