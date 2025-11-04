"use client";

import Image from "next/image";
import { useState } from "react";

type Cart = Record<string, number>;

const WHATSAPP = "+5544988606483";
const PIX_KEY = "44988606483";

const PRODUCTS = [
  { id: "camiseta-preta", name: "Camiseta Preta", price: 69.9, image: "/images/camiseta-preta.jpg" },
  { id: "camiseta-branca", name: "Camiseta Branca", price: 69.9, image: "/images/camiseta-branca.jpg" },
  { id: "moletom", name: "Moletom", price: 159.9, image: "/images/moletom.jpg" },
  { id: "bone", name: "Boné", price: 59.9, image: "/images/bone.jpg" }
];

const BRANDS = ["nokia", "canon", "samsung", "apple"];

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Page() {
  const [cart, setCart] = useState<Cart>({});

  const items = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id)!;
      return { ...p, qty, subtotal: p.price * qty };
    });

  const total = items.reduce((acc, i) => acc + i.subtotal, 0);

  function add(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }

  function remove(id: string) {
    setCart((c) => {
      const next: Cart = { ...c };
      if (!next[id]) return c;
      next[id] = next[id] - 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }

  const waNumber = WHATSAPP.replace(/\D/g, "");
  const waMsg = "Olá! Quero finalizar meu pedido:\n\n"
    + items.map((i) => "• " + i.name + " x" + i.qty + " — " + brl(i.subtotal)).join("\n")
    + "\n\nTotal: " + brl(total);
  const waLink = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(waMsg);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Topbar */}
      <div className="border-b border-zinc-900 bg-zinc-950/70 text-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <span className="hidden sm:block">Bem-vinda à <b>Loja da Jane</b> ✨</span>
          <a href={"https://wa.me/" + waNumber} target="_blank" className="opacity-80 hover:opacity-100">
            Suporte: WhatsApp {WHATSAPP}
          </a>
          <span className="opacity-70">Carrinho: {items.length} itens — {brl(total)}</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
          <a href="/" className="font-bold text-xl whitespace-nowrap">
            <span className="bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">u</span>commerce
          </a>
          <div className="hidden gap-6 sm:flex">
            <a href="#" className="hover:text-emerald-400">Home</a>
            <a href="#catalogo" className="hover:text-emerald-400">Catálogo</a>
            <a href="#contato" className="hover:text-emerald-400">Contato</a>
          </div>
        </nav>
      </header>

      {/* Herói */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/40">
          <div className="grid gap-6 p-6 md:grid-cols-2 md:gap-10 md:p-10">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                iPhone 6 <span className="text-emerald-400">Plus</span>
              </h1>
              <p className="mt-3 max-w-xl text-zinc-300">
                Exemplo de banner. Para trocar, substitua o arquivo{" "}
                <code className="rounded bg-zinc-800 px-2 py-1 text-zinc-200">/public/banner.jpg</code>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#catalogo" className="inline-flex items-center rounded-md bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700">
                  Ver produtos
                </a>
                <a href={waLink} target="_blank" className="inline-flex items-center rounded-md border border-zinc-700 px-6 py-3 font-medium hover:bg-zinc-900">
                  Finalizar no WhatsApp
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-56 w-full overflow-hidden rounded-xl border border-zinc-800 shadow-inner md:h-64 lg:h-80">
                <Image src="/banner.jpg" alt="Banner da loja" fill priority className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="mx-auto max-w-6xl px-4 pb-2 pt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 p-5 bg-sky-900/40">
            <div className="text-lg font-semibold">30 dias para troca</div>
            <div className="mt-1 text-zinc-300">Sem estresse</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-5 bg-amber-900/40">
            <div className="text-lg font-semibold">Frete grátis*</div>
            <div className="mt-1 text-zinc-300">Consulte condições</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-5 bg-rose-900/40">
            <div className="text-lg font-semibold">Pagamentos seguros</div>
            <div className="mt-1 text-zinc-300">Pix, Cartão</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 p-5 bg-emerald-900/40">
            <div className="text-lg font-semibold">Novidades semanais</div>
            <div className="mt-1 text-zinc-300">Sempre tem coisa nova</div>
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-6">
          <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-4">
            {BRANDS.map((b) => (
              <Image key={b} src={"/brands/" + b + ".png"} alt={b} width={160} height={80} className="mx-auto h-10 w-auto object-contain opacity-80" />
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="mx-auto max-w-6xl px-4 pb-12 pt-10">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Últimos Produtos</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/40">
              <div className="relative h-56 w-full">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="text-lg font-medium">{p.name}</div>
                <div className="mt-1 text-xl font-semibold">{brl(p.price)}</div>
                <div className="mt-4 flex items-center gap-3">
                  <button onClick={() => add(p.id)} className="flex-1 rounded-md bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700">
                    Adicionar
                  </button>
                  <button onClick={() => remove(p.id)} className="rounded-md border border-zinc-700 px-3 py-3 hover:bg-zinc-900" title="Remover 1 do carrinho">
                    −
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Carrinho */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">Carrinho</h2>
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-4">
          {items.length === 0 ? (
            <p className="text-zinc-300">Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3">
                    <span className="text-zinc-200">{i.name} x{i.qty}</span>
                    <span className="tabular-nums">{brl(i.subtotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold tabular-nums">{brl(total)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={waLink} target="_blank" className="inline-flex items-center rounded-md bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700">
                  Finalizar no WhatsApp
                </a>
                <button onClick={() => setCart({})} className="inline-flex items-center rounded-md border border-zinc-700 px-6 py-3 font-medium hover:bg-zinc-900">
                  Limpar carrinho
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="mx-auto max-w-6xl px-4 pb-20 pt-2 text-zinc-200">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">Pagamento & Contato</h2>
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/40 p-5">
          <div className="grid gap-6 sm:grid-cols-[1.2fr,1fr]">
            <div>
              <div className="mb-1 text-sm text-zinc-400">WhatsApp</div>
              <a href={"https://wa.me/" + waNumber} target="_blank" className="text-lg font-medium text-emerald-400 hover:underline">
                {WHATSAPP}
              </a>

              <div className="mt-5 text-sm text-zinc-400">Chave PIX</div>
              <div className="mt-1 flex items-center gap-3">
                <span className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono">{PIX_KEY}</span>
                <button onClick={() => navigator.clipboard.writeText(PIX_KEY)} className="rounded-md border border-zinc-700 px-3 py-2 hover:bg-zinc-900">
                  Copiar chave
                </button>
              </div>

              <p className="mt-4 text-zinc-300">Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.</p>
            </div>

            <div className="rounded-xl border border-zinc-800 p-4 text-sm text-zinc-400">
              Personalize as imagens em <code className="rounded bg-zinc-800 px-1">/public</code> (banner, logos) e em{" "}
              <code className="rounded bg-zinc-800 px-1">/images</code> (produtos).
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-zinc-400">© 2025 Loja da Jane — feito com amor 💚</p>
      </section>
    </main>
  );
}
