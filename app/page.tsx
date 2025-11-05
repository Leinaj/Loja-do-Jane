// app/page.tsx
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

function Features() {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-[#0b1620] p-6">
          <h3 className="text-lg font-semibold text-white">30 dias para troca</h3>
          <p className="text-zinc-400">Sem estresse</p>
        </div>
        <div className="rounded-3xl bg-[#20120e] p-6">
          <h3 className="text-lg font-semibold text-white">Frete grátis*</h3>
          <p className="text-zinc-400">Consulte condições</p>
        </div>
        <div className="rounded-3xl bg-[#1a0f16] p-6">
          <h3 className="text-lg font-semibold text-white">Pagamentos seguros</h3>
          <p className="text-zinc-400">Pix, Cartão</p>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";

function PixCopy() {
  const [ok, setOk] = useState(false);
  const pix = "44988606483";
  return (
    <div className="flex items-center gap-3">
      <code className="rounded-xl bg-zinc-800 px-3 py-2 text-lg text-zinc-100">
        {pix}
      </code>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(pix);
            setOk(true);
            setTimeout(() => setOk(false), 1500);
          } catch {}
        }}
        className="rounded-xl border border-zinc-700 px-4 py-2 text-zinc-100 hover:bg-zinc-800"
      >
        {ok ? "Copiado!" : "Copiar chave"}
      </button>
    </div>
  );
}

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
              <a
                className="text-emerald-400 underline"
                href="https://wa.me/5544988606483"
                target="_blank"
              >
                +55 (44) 98860-6483
              </a>
            </div>
            <PixCopy />
            <p className="text-zinc-400">
              Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}