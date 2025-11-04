// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

/** ====== CONFIG RÁPIDA ====== */
const WHATSAPP = "+5544988606483";
const PIX_KEY = "44988606483";

type Product = {
  id: string;
  name: string;
  price: number; // em reais
  image: string; // caminho dentro de /public
};

const PRODUCTS: Product[] = [
  { id: "camiseta-preta",  name: "Camiseta Preta",  price: 69.9,  image: "/images/camiseta-preta.jpg" },
  { id: "camiseta-branca", name: "Camiseta Branca", price: 69.9,  image: "/images/camiseta-branca.jpg" },
  { id: "moletom",         name: "Moletom",         price: 159.9, image: "/images/moletom.jpg" },
  { id: "bone",            name: "Boné",            price: 59.9,  image: "/images/bone.jpg" },
];

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Page() {
  // carrinho: id -> quantidade
  const [cart, setCart] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const addToCart = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  };

  const items = useMemo(() => {
    // junta dados do produto + qtd
    return Object.entries(cart)
      .map(([id, qty]) => {
        const p = PRODUCTS.find((x) => x.id === id);
        if (!p) return null;
        return { ...p, qty };
      })
      .filter(Boolean) as (Product & { qty: number })[];
  }, [cart]);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  );

  const waText = useMemo(() => {
    if (items.length === 0) return "Olá! Quero fazer um pedido.";
    const linhas = items.map(
      (it) => `- ${it.name} x${it.qty} = ${formatBRL(it.price * it.qty)}`
    );
    linhas.push(`Total: ${formatBRL(total)}`);
    return `Olá! Segue meu pedido:\n${linhas.join("\n")}`;
  }, [items, total]);

  const waLink = `https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=${encodeURIComponent(
    waText
  )}`;

  async function handleCopyPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      // volta para "Copiar chave" depois de 2s
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback simples
      alert("Não foi possível copiar automaticamente. Sua chave: " + PIX_KEY);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f0e] text-zinc-100">
      {/* Barra de topo */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-2 text-xs sm:text-sm flex items-center justify-between">
          <div>
            Bem-vinda à <span className="font-semibold">Loja da Jane</span> ✨
          </div>
          <div className="hidden sm:block">
            Suporte: WhatsApp{" "}
            <Link
              className="text-emerald-400 hover:underline"
              href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`}
              target="_blank"
            >
              {WHATSAPP}
            </Link>
          </div>
          <div className="opacity-80">
            Carrinho: {items.length} itens — {formatBRL(total)}
          </div>
        </div>
      </div>

      {/* Header simples */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
          <span className="text-lg font-semibold">
            <span className="text-emerald-400">u</span>commerce
          </span>
          <nav className="ml-auto flex gap-6 text-sm">
            <a className="opacity-80 hover:opacity-100" href="#home">Home</a>
            <a className="opacity-80 hover:opacity-100" href="#catalogo">Catálogo</a>
            <a className="opacity-80 hover:opacity-100" href="#contato">Contato</a>
          </nav>
        </div>
      </header>

      {/* Hero / Banner */}
      <section id="home" className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-neutral-900">
          <Image
            src="/banner.jpg"
            alt="Promoção"
            width={1600}
            height={500}
            className="w-full h-auto object-cover"
            priority
          />
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-semibold">
              iPhone 6 <span className="text-emerald-400">Plus</span>
            </h1>
            <p className="mt-2 text-zinc-300">
              Exemplo de banner. Para trocar, substitua o arquivo{" "}
              <code className="px-2 py-1 rounded bg-black/50 border border-white/10">
                /public/banner.jpg
              </code>
              .
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#catalogo"
                className="rounded-md bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-sm font-medium"
              >
                Ver produtos
              </a>
              <a
                href={waLink}
                target="_blank"
                className="rounded-md border border-white/10 hover:border-white/20 px-6 py-3 text-sm font-medium"
              >
                Finalizar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="mx-auto max-w-6xl px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#08202B] p-5">
          <div className="text-xl font-semibold">30 dias para troca</div>
          <div className="opacity-75">Sem estresse</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#2A1E07] p-5">
          <div className="text-xl font-semibold">Frete grátis*</div>
          <div className="opacity-75">Consulte condições</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#2A0E13] p-5">
          <div className="text-xl font-semibold">Pagamentos seguros</div>
          <div className="opacity-75">Pix, Cartão</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0A1F1C] p-5">
          <div className="text-xl font-semibold">Novidades semanais</div>
          <div className="opacity-75">Sempre tem coisa nova</div>
        </div>
      </section>

      {/* Marcas */}
      <section className="mx-auto max-w-6xl px-4 mt-8">
        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center">
          {[
            { src: "/brands/nokia.png", alt: "Nokia" },
            { src: "/brands/canon.png", alt: "Canon" },
            { src: "/brands/samsung.png", alt: "Samsung" },
            { src: "/brands/apple.png", alt: "Apple" },
          ].map((b) => (
            <div key={b.alt} className="relative h-12 w-32 opacity-80">
              <Image src={b.src} alt={b.alt} fill className="object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="mx-auto max-w-6xl px-4 mt-10">
        <h2 className="text-2xl font-semibold">Últimos Produtos</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-white/10 bg-neutral-900 overflow-hidden"
            >
              <div className="relative aspect-[4/3]">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-medium">{p.name}</h3>
                <div className="mt-1 text-lg">{formatBRL(p.price)}</div>
                <button
                  onClick={() => addToCart(p.id)}
                  className="mt-4 w-full rounded-md bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-sm font-medium"
                >
                  Adicionar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Carrinho */}
      <section className="mx-auto max-w-6xl px-4 mt-10">
        <h2 className="text-2xl font-semibold">Carrinho</h2>
        <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-900 p-5">
          {items.length === 0 ? (
            <div className="opacity-70">Seu carrinho está vazio.</div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="opacity-90">
                    {it.name} <span className="opacity-60">x{it.qty}</span>
                  </div>
                  <div>{formatBRL(it.price * it.qty)}</div>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex items-center justify-between font-medium">
                <span>Total</span>
                <span>{formatBRL(total)}</span>
              </div>
              <div className="pt-2">
                <a
                  href={waLink}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-sm font-medium"
                >
                  Finalizar no WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pagamento & Contato */}
      <section id="contato" className="mx-auto max-w-6xl px-4 mt-10 pb-16">
        <h2 className="text-2xl font-semibold">Pagamento & Contato</h2>

        <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-900 p-5 space-y-4">
          <div>
            <div className="text-sm opacity-70">WhatsApp</div>
            <Link
              href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`}
              target="_blank"
              className="text-emerald-400 hover:underline text-lg font-medium"
            >
              {WHATSAPP}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <div className="text-sm opacity-70">Chave PIX</div>
              <div className="mt-1 rounded-md bg-black/50 border border-white/10 px-4 py-2 font-mono">
                {PIX_KEY}
              </div>
            </div>
            <button
              onClick={handleCopyPix}
              disabled={copied}
              className={`mt-6 sm:mt-8 rounded-md px-4 py-2 text-sm font-medium border ${
                copied
                  ? "bg-emerald-700 border-emerald-700 cursor-default"
                  : "bg-transparent border-white/15 hover:border-white/30"
              }`}
              aria-live="polite"
            >
              {copied ? "Copiado!" : "Copiar chave"}
            </button>
          </div>

          <p className="opacity-75">
            Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
          </p>
        </div>

        <footer className="mt-8 pb-6 text-center opacity-70">
          © 2025 Loja da Jane — feito com amor 💚
        </footer>
      </section>
    </main>
  );
}
