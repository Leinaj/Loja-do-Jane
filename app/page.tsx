import Image from "next/image";
import PixCopy from "@/components/PixCopy";

const produtos = [
  { id: "moletom", nome: "Moletom", preco: "R$ 159,90", img: "/images/moletom.jpg" },
  { id: "bone",    nome: "Boné",     preco: "R$ 59,90",  img: "/images/bone.jpg" },
  { id: "cam-pre", nome: "Camiseta Preta",  preco: "R$ 49,90", img: "/images/camiseta-preta.jpg" },
  { id: "cam-bra", nome: "Camiseta Branca", preco: "R$ 49,90", img: "/images/camiseta-branca.jpg" },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* HERO - agora com altura fixa responsiva */}
      <section className="relative h-40 sm:h-56 md:h-72 rounded-2xl overflow-hidden">
        <Image
          src="/images/banner.jpg"
          alt="Promoções"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Grid de produtos */}
      <section>
        <h1 className="text-3xl font-bold mb-4">Produtos</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((p) => (
            <div key={p.id} className="card">
              <div className="relative h-56 rounded-xl overflow-hidden">
                <Image src={p.img} alt={p.nome} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{p.nome}</h2>
                <p className="text-emerald-400 mt-1">{p.preco}</p>
                <button className="btn-ghost mt-3">Ver</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagamento & Contato */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Pagamento & Contato</h2>
        <div className="card p-5 flex flex-col gap-4">
          <div>
            <div className="text-zinc-400 text-sm">WhatsApp</div>
            <a href="https://wa.me/5544988606483" className="btn-ghost mt-2 inline-block">
              +55 (44) 98860-6483
            </a>
          </div>
          <div>
            <div className="text-zinc-400 text-sm">Chave PIX</div>
            <PixCopy value="44988606483" />
          </div>
          <p className="text-zinc-400">
            Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
          </p>
        </div>
      </section>

      <footer className="text-center text-zinc-400 pt-6">
        © 2025 Loja da Jane — feito com amor 💚
      </footer>
    </main>
  );
}