"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import PixCopy from "@/components/PixCopy";

type Address = {
  cep?: string; rua?: string; numero?: string; complemento?: string;
  bairro?: string; cidade?: string; uf?: string;
};

export default function Page() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [addr, setAddr] = useState<Address>({});
  const pixKey = "44988606483"; // sua chave PIX

  const add = (p: Product) =>
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
  const inc = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 1) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const n = Math.max((c[id] ?? 1) - 1, 0);
      const { [id]: _, ...rest } = n === 0 ? c : { ...c, [id]: n };
      return n === 0 ? rest : { ...c, [id]: n };
    });

  const items = useMemo(
    () => PRODUCTS.filter(p => cart[p.id]).map(p => ({ p, q: cart[p.id] })),
    [cart]
  );

  const total = items.reduce((sum, it) => sum + it.p.price * it.q, 0);

  const msg = useMemo(() => {
    const linhas = [
      "🛒 *Pedido Loja da Jane*",
      ...items.map(it => `• ${it.p.name} x${it.q} — R$ ${((it.p.price*it.q)/100).toFixed(2)}`),
      `*Total:* R$ ${(total/100).toFixed(2)}`,
      "",
      "📦 *Endereço de Entrega*",
      `CEP: ${addr.cep ?? ""}`,
      `Rua: ${addr.rua ?? ""}, Nº ${addr.numero ?? ""}`,
      `Compl.: ${addr.complemento ?? ""}`,
      `Bairro: ${addr.bairro ?? ""}`,
      `Cidade/UF: ${addr.cidade ?? ""}/${addr.uf ?? ""}`
    ];
    return linhas.join("\n").trim();
  }, [items, total, addr]);

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="hero-wrap">
        <div className="hero-img">
          <Image
            src="/banner.jpg" /* troque por sua imagem */
            alt="Promoções"
            width={1600}
            height={600}
            priority
          />
        </div>
        <div className="mt-4">
          <h1>iPhone 6 <span className="text-emerald-500">Plus</span></h1>
          <p className="text-zinc-400">
            Exemplo de banner. Para trocar, substitua o arquivo <code>/public/banner.jpg</code>.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#catalogo" className="btn btn-primary">Ver produtos</a>
            <a href={`https://wa.me/5544988606483?text=${encodeURIComponent("Quero comprar!")}`} target="_blank" className="btn btn-ghost">Finalizar no WhatsApp</a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card"><div className="text-xl">30 dias para troca</div><div className="text-zinc-400">Sem estresse</div></div>
        <div className="card"><div className="text-xl">Frete grátis*</div><div className="text-zinc-400">Consulte condições</div></div>
        <div className="card"><div className="text-xl">Pagamentos seguros</div><div className="text-zinc-400">Pix, Cartão</div></div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" className="space-y-4">
        <h2>Produtos</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PRODUCTS.map(p => (
            <ProductCard key={p.id} p={p} onAdd={add} />
          ))}
        </div>
      </section>

      {/* CARRINHO */}
      <section className="space-y-3">
        <h2>Carrinho</h2>
        {items.length === 0 ? (
          <div className="card text-zinc-400">Seu carrinho está vazio.</div>
        ) : (
          <div className="card space-y-3">
            {items.map(({ p, q }) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>{p.name} <span className="text-zinc-400">— R$ {(p.price/100).toFixed(2)}</span></div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost" onClick={() => dec(p.id)}>-</button>
                  <div className="w-8 text-center">{q}</div>
                  <button className="btn btn-ghost" onClick={() => inc(p.id)}>+</button>
                </div>
              </div>
            ))}
            <div className="pt-2 flex justify-between border-t border-zinc-800">
              <div className="font-semibold">Total:</div>
              <div className="font-bold text-emerald-400">R$ {(total/100).toFixed(2)}</div>
            </div>
          </div>
        )}
      </section>

      {/* ENDEREÇO */}
      <section className="space-y-3">
        <h2>Endereço de Entrega</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder="CEP" className="card" onChange={e=>setAddr(a=>({...a,cep:e.target.value}))} />
          <input placeholder="Rua" className="card" onChange={e=>setAddr(a=>({...a,rua:e.target.value}))} />
          <input placeholder="Número" className="card" onChange={e=>setAddr(a=>({...a,numero:e.target.value}))} />
          <input placeholder="Complemento" className="card" onChange={e=>setAddr(a=>({...a,complemento:e.target.value}))} />
          <input placeholder="Bairro" className="card" onChange={e=>setAddr(a=>({...a,bairro:e.target.value}))} />
          <input placeholder="Cidade" className="card" onChange={e=>setAddr(a=>({...a,cidade:e.target.value}))} />
          <input placeholder="UF" className="card" onChange={e=>setAddr(a=>({...a,uf:e.target.value}))} />
        </div>
      </section>

      {/* CONTATO & PIX */}
      <section id="contato" className="space-y-4">
        <h2>Pagamento & Contato</h2>
        <div className="card space-y-4">
          <div>
            <div className="text-zinc-400">WhatsApp</div>
            <a className="text-emerald-400 underline" target="_blank" href="https://wa.me/5544988606483">
              +55 (44) 98860-6483
            </a>
          </div>

          <div>
            <div className="text-zinc-400 mb-2">Chave PIX</div>
            <PixCopy pix={pixKey} />
          </div>

          <p className="text-zinc-400">
            Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
          </p>

          <a
            className="btn btn-primary w-full sm:w-auto"
            target="_blank"
            href={`https://wa.me/5544988606483?text=${encodeURIComponent(msg)}`}
          >
            Finalizar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}