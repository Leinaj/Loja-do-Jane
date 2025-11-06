"use client";
import Image from "next/image";
import { useState } from "react";

const produtos = [
  { id: "moletom", nome: "Moletom", preco: 159.9, img: "/images/moletom.jpg" },
  { id: "bone", nome: "Boné", preco: 59.9, img: "/images/bone.jpg" },
  { id: "camiseta-preta", nome: "Camiseta Preta", preco: 49.9, img: "/images/camiseta-preta.jpg" },
  { id: "camiseta-branca", nome: "Camiseta Branca", preco: 49.9, img: "/images/camiseta-branca.jpg" },
];

export default function Home() {
  const [ok, setOk] = useState(false);
  const copiarPix = async () => { await navigator.clipboard.writeText("44988606483"); setOk(true); setTimeout(()=>setOk(false),1200); };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="container h-14 flex items-center justify-between">
          <a href="/" className="font-semibold">Loja da Jane</a>
          <nav className="hidden sm:flex gap-6 text-sm text-zinc-300">
            <a href="#catalogo" className="hover:text-white">Catálogo</a>
            <a href="#contato" className="hover:text-white">Contato</a>
          </nav>
          <a href="https://wa.me/5544988606483" className="btn-primary">WhatsApp</a>
        </div>
      </header>

      <section className="container mt-6">
        <div className="relative h-[180px] sm:h-[260px] md:h-[320px] overflow-hidden rounded-2xl">
          <Image src="/images/banner.jpg" alt="Promoções" fill priority className="object-cover" />
        </div>
      </section>

      <section id="catalogo" className="container py-8">
        <h1 className="mb-4 text-3xl font-bold">Produtos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {produtos.map((p) => (
            <article key={p.id} className="card">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={p.img} alt={p.nome} fill className="object-cover" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{p.nome}</h2>
                  <p className="text-emerald-400">R$ {p.preco.toFixed(2)}</p>
                </div>
                <a href="#contato" className="btn bg-zinc-900">Ver</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contato" className="container pb-16">
        <h2 className="mb-4 text-2xl font-bold">Pagamento & Contato</h2>
        <div className="card">
          <p className="text-sm text-zinc-400">WhatsApp</p>
          <a className="inline-block underline underline-offset-4 text-emerald-400" href="https://wa.me/5544988606483">
            +55 (44) 98860-6483
          </a>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input readOnly value="44988606483" className="w-full sm:w-64 bg-zinc-900 rounded-xl px-4 py-2 border border-zinc-800" />
            <button onClick={copiarPix} className="btn-primary">{ok ? "Copiada!" : "Copiar chave"}</button>
          </div>

          <p className="mt-4 text-sm text-zinc-400">Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.</p>
        </div>
      </section>

      <footer className="border-t border-zinc-800">
        <div className="container px-4 py-6 text-center text-zinc-400">
          © 2025 Loja da Jane — feito com amor 💚
        </div>
      </footer>
    </main>
  );
}