"use client";

import Image from "next/image";
import { useState } from "react";

const produtos = [
  { id: "moletom", nome: "Moletom", preco: 159.9, img: "/images/moletom.jpg" },
  { id: "bone", nome: "Boné", preco: 59.9, img: "/images/bone.jpg" },
];

export default function Home() {
  const [ok, setOk] = useState(false);

  const copiarPix = async () => {
    await navigator.clipboard.writeText("44988606483");
    setOk(true);
    setTimeout(() => setOk(false), 1200);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="container mx-auto max-w-5xl h-14 px-4 flex items-center justify-between">
          <a href="/" className="font-semibold">Loja da Jane</a>
          <nav className="hidden sm:flex gap-6 text-sm text-zinc-300">
            <a href="#catalogo" className="hover:text-white">Catálogo</a>
            <a href="#contato" className="hover:text-white">Contato</a>
          </nav>
          <a href="https://wa.me/5544988606483" className="btn-primary rounded-xl px-4 py-2">
            WhatsApp
          </a>
        </div>
      </header>

      {/* Banner */}
      <section className="container mx-auto max-w-5xl px-4 mt-6">
        <div className="relative h-[180px] sm:h-[260px] md:h-[320px] overflow-hidden rounded-2xl">
          {/* troque o caminho abaixo para o seu banner, ex: /images/banner.jpg */}
          <Image src="/images/moletom.jpg" alt="Promoções" fill priority className="object-cover" />
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="container mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">Produtos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {produtos.map((p) => (
            <article key={p.id} className="bg-[#121212] rounded-2xl p-4 border border-zinc-800">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={p.img} alt={p.nome} fill className="object-cover" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{p.nome}</h2>
                  <p className="text-emerald-400">R$ {p.preco.toFixed(2)}</p>
                </div>
                <a href="#contato" className="rounded-xl px-4 py-2 bg-zinc-900 border border-zinc-800">
                  Ver
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contato / PIX */}
      <section id="contato" className="container mx-auto max-w-5xl px-4 pb-16">
        <h2 className="mb-4 text-2xl font-bold">Pagamento & Contato</h2>
        <div className="bg-[#121212] rounded-2xl p-5 border border-zinc-800">
          <p className="text-sm text-zinc-400">WhatsApp</p>
          <a
            className="inline-block underline underline-offset-4 text-emerald-400"
            href="https://wa.me/5544988606483"
          >
            +55 (44) 98860-6483
          </a>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              readOnly
              value="44988606483"
              className="w-full sm:w-64 bg-zinc-900 rounded-xl px-4 py-2 border border-zinc-800"
            />
            <button onClick={copiarPix} className="rounded-xl px-4 py-2 bg-emerald-600 hover:bg-emerald-500">
              {ok ? "Copiada!" : "Copiar chave"}
            </button>
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="container mx-auto max-w-5xl px-4 py-6 text-center text-zinc-400">
          © 2025 Loja da Jane — feito com amor 💚
        </div>
      </footer>
    </main>
  );
}