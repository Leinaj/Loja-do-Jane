// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { products, formatBRL } from "@/lib/products";
import PixCopy from "@/components/PixCopy";

export default function HomePage() {
  const items = Object.values(products);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Banner limitado */}
      <section className="mb-8">
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <Image
            src="/banner.jpg" // coloque em /public/banner.jpg; se usar /images/banner.jpg, troque aqui
            alt="Promoções"
            width={1200}
            height={480}
            priority
            sizes="(max-width: 640px) 100vw, 1200px"
            className="w-full h-auto max-h-[360px] object-cover sm:max-h-[420px]"
          />
        </div>
      </section>

      <h1 className="mb-4 text-3xl font-bold">Produtos</h1>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((p) => (
          <article
            key={p.slug}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3 transition-shadow hover:shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
          >
            <div className="overflow-hidden rounded-xl">
              <Image
                src={p.image}
                alt={p.title}
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, 600px"
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            </div>

            <div className="mt-3">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="mt-1 text-emerald-400">{formatBRL(p.price)}</p>
              <div className="mt-3">
                <Link
                  href={`/produto/${p.slug}`}
                  className="rounded-xl border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-800"
                >
                  Ver
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Confiança + Contato */}
      <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-4 text-2xl font-bold">Pagamento &amp; Contato</h2>

        <ul className="mb-6 grid list-disc grid-cols-1 gap-2 pl-5 text-sm text-zinc-400 sm:grid-cols-2">
          <li>Envio rápido e atendimento no Whats.</li>
          <li>Fotos reais do produto.</li>
          <li>Troca garantida em até 7 dias.</li>
          <li>Preço justo, sem pegadinha.</li>
        </ul>

        <div className="mb-5">
          <p className="mb-1 text-sm text-zinc-400">WhatsApp</p>
          <a
            href="https://wa.me/5544988606483"
            target="_blank"
            className="inline-block border-b-2 border-emerald-500 pb-0.5 text-lg font-medium text-emerald-400"
          >
            +55 (44) 98860-6483
          </a>
        </div>

        <div>
          <p className="mb-2 text-sm text-zinc-400">Chave PIX</p>
          <PixCopy pix="44988606483" />
        </div>
      </section>
    </main>
  );
}