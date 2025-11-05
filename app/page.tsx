import Image from "next/image";
import Link from "next/link";
import Pix from "../components/Pix";

type Product = { slug: string; name: string; price: number; image: string };

const products: Product[] = [
  { slug: "moletom", name: "Moletom", price: 159.9, image: "/images/moletom.jpg" },
  { slug: "bone", name: "Boné", price: 59.9, image: "/images/bone.jpg" },
];

export default function Page() {
  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-semibold tracking-tight">
            <span className="rounded-xl bg-emerald-500/10 px-2 py-1 text-emerald-400">
              Loja da Jane
            </span>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            <Link href="/catalogo" className="hover:text-emerald-400">Catálogo</Link>
            <Link href="/contato" className="hover:text-emerald-400">Contato</Link>
            <a
              href="https://wa.me/5544988606483?text=Ol%C3%A1%2C%20vim%20pela%20Loja%20da%20Jane%20%F0%9F%91%8B"
              target="_blank" rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold">Produtos</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.slug} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="space-y-3 p-4">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-emerald-400">
                  {p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <div className="flex gap-3">
                  <Link href={`/p/${p.slug}`} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">
                    Ver
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-4 text-2xl font-semibold">Pagamento & Contato</h2>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-4">
            <p className="mb-1 text-sm text-zinc-400">WhatsApp</p>
            <a
              href="https://wa.me/5544988606483?text=Ol%C3%A1%2C%20vim%20pela%20Loja%20da%20Jane%20%F0%9F%91%8B"
              target="_blank" rel="noopener noreferrer"
              className="text-lg underline decoration-emerald-500 decoration-2 underline-offset-4"
            >
              +55 (44) 98860-6483
            </a>
          </div>
          <div className="mb-2">
            <p className="mb-2 text-sm text-zinc-400">Chave PIX</p>
            <Pix />
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
          </p>
        </div>
      </section>
    </main>
  );
}