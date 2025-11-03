'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

const WHATSAPP = '5544988606483'; // com DDI 55
const PIX = '44988606483';

const PRODUCTS = [
  { id: 'camiseta-preta',  name: 'Camiseta Preta',  price: 69.9,  img: '/images/camiseta-preta.jpg' },
  { id: 'camiseta-branca', name: 'Camiseta Branca', price: 69.9,  img: '/images/camiseta-branca.jpg' },
  { id: 'moletom',         name: 'Moletom',         price: 159.9, img: '/images/moletom.jpg' },
  { id: 'bone',            name: 'Boné',            price: 59.9,  img: '/images/bone.jpg' },
];

const BENEFITS = [
  { title: '30 dias para troca', desc: 'Sem estresse' },
  { title: 'Frete grátis*',     desc: 'Consulte condições' },
  { title: 'Pagamentos seguros',desc: 'Pix, Cartão' },
  { title: 'Novidades semanais',desc: 'Sempre tem coisa nova' },
];

const brl = (v:number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const productMap = useMemo(
    () => Object.fromEntries(PRODUCTS.map(p => [p.id, p])),
    []
  );

  const items = Object.entries(cart).map(([id, qty]) => ({
    ...productMap[id],
    qty,
    subtotal: productMap[id].price * qty,
  }));

  const total = items.reduce((s, it) => s + it.subtotal, 0);

  function addToCart(id: string) {
    setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }
  function removeFromCart(id: string) {
    setCart(prev => {
      const q = (prev[id] ?? 0) - 1;
      const n = { ...prev };
      if (q <= 0) delete n[id]; else n[id] = q;
      return n;
    });
  }

  const waText = encodeURIComponent(
    [
      'Olá! Quero finalizar meu pedido 😄',
      '',
      ...items.map(it => `• ${it.name} x${it.qty} — ${brl(it.subtotal)}`),
      '',
      `Total: ${brl(total)}`,
      `Chave Pix: ${PIX}`,
    ].join('\n'),
  );
  const waLink = `https://wa.me/${WHATSAPP}?text=${waText}`;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-8">

        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded bg-emerald-600/20 text-emerald-400 px-2 py-1 text-xs">U</div>
            <span className="font-semibold">commerce</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-zinc-300">
            <a href="#home">Home</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#contato">Contato</a>
          </nav>
          <div className="text-sm">Carrinho: {items.length} itens — {brl(total)}</div>
        </header>

        {/* HERO SIMPLES */}
        <section id="home" className="rounded-xl border border-zinc-800 p-6 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">iPhone 6 Plus</h1>
              <p className="text-zinc-300 mt-2">
                Exemplo de banner. Você pode trocar por uma imagem sua aqui.
              </p>
              <div className="mt-4 flex gap-3">
                <a href="#catalogo" className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm">
                  Ver produtos
                </a>
                <a href={waLink} target="_blank" className="px-4 py-2 rounded border border-zinc-700 text-sm">
                  Finalizar no WhatsApp
                </a>
              </div>
            </div>
            <div className="flex-1 w-full h-40 md:h-48 rounded-lg overflow-hidden border border-zinc-800">
              {/* se quiser, troque por uma imagem de banner */}
              <div className="w-full h-full bg-zinc-900 grid place-items-center text-zinc-500 text-sm">
                espaço do banner
              </div>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFITS.map(b => (
            <div key={b.title} className="rounded-lg border border-zinc-800 p-4 bg-zinc-900/40">
              <div className="font-medium">{b.title}</div>
              <div className="text-zinc-400 text-sm">{b.desc}</div>
            </div>
          ))}
        </section>

        {/* CATÁLOGO */}
        <section id="catalogo" className="space-y-4">
          <h2 className="text-lg font-semibold">Últimos Produtos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.map(p => (
              <div key={p.id} className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900/40">
                <div className="relative w-full h-40">
                  <Image src={p.img} alt={p.name} fill className="object-cover" />
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-sm">{p.name}</div>
                  <div className="text-zinc-400 text-sm">{brl(p.price)}</div>
                  <div className="flex gap-2 pt-2">
                    <button
                      className="px-2 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500"
                      onClick={() => addToCart(p.id)}
                    >
                      Adicionar
                    </button>
                    {(cart[p.id] ?? 0) > 0 && (
                      <button
                        className="px-2 py-1 text-xs rounded border border-zinc-700"
                        onClick={() => removeFromCart(p.id)}
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CARRINHO */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Carrinho</h2>
          {items.length === 0 ? (
            <p className="text-zinc-400 text-sm">Seu carrinho está vazio.</p>
          ) : (
            <div className="rounded-lg border border-zinc-800 p-4 bg-zinc-900/40 space-y-2">
              {items.map(it => (
                <div key={it.id} className="flex justify-between text-sm">
                  <span>{it.name} x{it.qty}</span>
                  <span>{brl(it.subtotal)}</span>
                </div>
              ))}
              <div className="border-t border-zinc-800 pt-2 flex justify-between font-medium">
                <span>Total</span><span>{brl(total)}</span>
              </div>
              <div className="pt-2">
                <a href={waLink} target="_blank" className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm">
                  Finalizar no WhatsApp
                </a>
              </div>
            </div>
          )}
        </section>

        {/* PAGAMENTO & CONTATO */}
        <section id="contato" className="rounded-lg border border-zinc-800 p-4 bg-zinc-900/40 space-y-2">
          <div className="text-sm">
            WhatsApp:{' '}
            <a className="underline" target="_blank" href={`https://wa.me/${WHATSAPP}`}>
              +55 44 98860-6483
            </a>
          </div>
          <div className="text-sm flex items-center gap-2">
            Chave Pix: <code className="bg-zinc-800 px-2 py-0.5 rounded">{PIX}</code>
            <button
              onClick={() => navigator.clipboard?.writeText(PIX)}
              className="text-xs px-2 py-1 rounded border border-zinc-700"
            >
              Copiar chave
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            Aceitamos Pix e Cartão. Entrega/retirada combinadas via WhatsApp.
          </p>
        </section>

      </div>
    </main>
  );
}
