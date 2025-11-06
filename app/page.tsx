import Image from "next/image";
import PixCopy from "@/components/PixCopy";

const produtos = [
  { id: "moletom", nome: "Moletom", preco: "R$ 159,90", img: "/moletom.jpg" },
  { id: "bone", nome: "Boné", preco: "R$ 59,90", img: "/bone.jpg" },
  { id: "camiseta", nome: "Camiseta", preco: "R$ 49,90", img: "/camiseta.jpg" },
];

const PIX = "44988606483";
const WHATS = "+55 (44) 98860-6483";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-10">
      {/* HERO / BANNER */}
      <div className="hero-wrap">
        <Image
          src="/banner.jpg"
          alt="Promoções"
          width={1600}
          height={500}
          priority
          className="hero-img rounded-2xl"
        />
      </div>

      {/* PRODUTOS */}
      <section className="space-y-4">
        <h1>Produtos</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <article key={p.id} className="card p-4">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={p.img}
                  alt={p.nome}
                  width={800}
                  height={800}
                  className="product-img"
                />
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <h2 className="text-xl font-semibold">{p.nome}</h2>
                <span className="text-emerald-500 font-medium">{p.preco}</span>
              </div>

              <div className="mt-4">
                <a
                  href={`https://wa.me/5544988606483?text=Tenho%20interesse%20no%20produto:%20${encodeURIComponent(
                    p.nome
                  )}`}
                  className="btn btn-ghost"
                >
                  Ver
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CONTATO / PIX */}
      <section className="card p-6">
        <h2 className="text-2xl font-bold mb-4">Pagamento & Contato</h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-zinc-400">WhatsApp</p>
            <a
              className="text-lg underline"
              href="https://wa.me/5544988606483"
              target="_blank"
              rel="noopener noreferrer"
            >
              {WHATS}
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="text-sm text-zinc-400">Chave PIX</div>
            <code className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
              {PIX}
            </code>
            <PixCopy keyPix={PIX} />
          </div>

          <p className="text-zinc-400 text-sm">
            Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
          </p>
        </div>
      </section>

      <footer className="text-center text-zinc-400 py-8">
        © 2025 Loja da Jane — feito com amor 💚
      </footer>
    </main>
  );
}