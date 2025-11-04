"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PRODUCTS, BRANDS, money } from "../lib/products";

type Product = (typeof PRODUCTS)[number];

const BASE_URL = "https://loja-do-jane.vercel.app";
const WHATSAPP_NUMBER = "5544988606483"; // só números
const PIX_KEY = "44988606483";

export default function Page() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [q, setQ] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [cliente, setCliente] = useState({ nome: "", cep: "", endereco: "" });
  const [utm, setUtm] = useState<{ source?: string; medium?: string; campaign?: string }>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setCart(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    setUtm({
      source: p.get("utm_source") || undefined,
      medium: p.get("utm_medium") || undefined,
      campaign: p.get("utm_campaign") || undefined,
    });
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PRODUCTS;
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(s));
  }, [q]);

  const items = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const p = PRODUCTS.find((x) => x.id === id)!;
        return { ...p, qty, subtotal: p.price * qty };
      });
  }, [cart]);

  const cartCount = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.subtotal, 0);

  const origem =
    utm.source || utm.medium || utm.campaign
      ? "\n\nOrigem do contato:\n"
        + (utm.source ? "utm_source=" + utm.source + "\n" : "")
        + (utm.medium ? "utm_medium=" + utm.medium + "\n" : "")
        + (utm.campaign ? "utm_campaign=" + utm.campaign : "")
      : "";

  const waMsg =
    "Olá! Segue meu pedido:\n\n"
    + (items.length
        ? items.map((i) => "• " + i.name + " x" + i.qty + " — " + money(i.subtotal)).join("\n")
          + "\n\nTotal: " + money(total)
        : "Quero fazer um pedido.")
    + (cliente.nome || cliente.cep || cliente.endereco
        ? "\n\nDados do cliente:\n"
          + (cliente.nome ? "Nome: " + cliente.nome + "\n" : "")
          + (cliente.cep ? "CEP: " + cliente.cep + "\n" : "")
          + (cliente.endereco ? "Endereço: " + cliente.endereco : "")
        : "")
    + "\n\nChave PIX: " + PIX_KEY
    + origem;

  const waLink = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(waMsg);

  function addToCart(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }
  function clearCart() {
    setCart({});
  }
  async function copiarPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
    } catch {
      const el = document.createElement("textarea");
      el.value = PIX_KEY;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }
  async function buscarCepAuto() {
    const cep = cliente.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const r = await fetch("https://viacep.com.br/ws/" + cep + "/json/");
      const data = await r.json();
      if (!data.erro) {
        const end = [data.logradouro, data.bairro, data.localidade + " - " + data.uf]
          .filter(Boolean)
          .join(", ");
        setCliente((c) => ({ ...c, endereco: c.endereco || end }));
      }
    } catch {}
  }

  const finalizarDisabled = items.length === 0;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Topbar */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 text-[13px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <span>Bem-vinda à <b>Loja da Jane</b> ✨</span>
          <div className="flex flex-wrap items-center gap-4 text-neutral-300">
            <a className="text-emerald-400 hover:underline" href={"https://wa.me/" + WHATSAPP_NUMBER} target="_blank" rel="noreferrer">
              WhatsApp: +55 44 98860-6483
            </a>
            <span className="hidden sm:inline">•</span>
            <span>Carrinho: {cartCount} {cartCount === 1 ? "item" : "itens"} — {money(total)}</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-neutral-800 bg-neutral-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-lg font-semibold"><span className="text-emerald-400">u</span>commerce</div>
          <ul className="flex items-center gap-6 text-sm text-neutral-300">
            <li><a className="hover:text-white" href="#home">Home</a></li>
            <li><a className="hover:text-white" href="#catalogo">Catálogo</a></li>
            <li><a className="hover:text-white" href="#contato">Contato</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3 sm:p-4">
          <div className="relative h-44 w-full sm:h-64 overflow-hidden rounded-xl">
            <Image src="/banner.jpg" alt="Banner da Loja da Jane" fill priority sizes="100vw" className="object-cover" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold">iPhone 6 <span className="text-emerald-400">Plus</span></h1>
              <p className="mt-2 text-neutral-400">
                Exemplo de banner. Troque o arquivo <code className="bg-neutral-800 px-1 py-0.5 rounded">/public/banner.jpg</code>.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="#catalogo" className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-500">
                  Ver produtos
                </a>
                <a
                  href={finalizarDisabled ? "#" : waLink}
                  onClick={finalizarDisabled ? (e) => e.preventDefault() : undefined}
                  target={finalizarDisabled ? undefined : "_blank"}
                  rel={finalizarDisabled ? undefined : "noreferrer"}
                  aria-disabled={finalizarDisabled}
                  className={
                    "rounded-lg px-5 py-2 font-medium " +
                    (finalizarDisabled
                      ? "cursor-not-allowed bg-neutral-800 text-neutral-500"
                      : "bg-transparent border border-neutral-700 text-neutral-200 hover:bg-neutral-800")
                  }
                >
                  Finalizar no WhatsApp
                </a>
              </div>
            </div>
            <div className="hidden sm:block" />
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-neutral-800 bg-[#062333] p-5">
            <div className="text-xl font-semibold">30 dias para troca</div>
            <div className="text-neutral-400">Sem estresse</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-[#2a1d00] p-5">
            <div className="text-xl font-semibold">Frete grátis*</div>
            <div className="text-neutral-400">Consulte condições</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-[#2b0b12] p-5">
            <div className="text-xl font-semibold">Pagamentos seguros</div>
            <div className="text-neutral-400">Pix, Cartão</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-[#072321] p-5">
            <div className="text-xl font-semibold">Novidades semanais</div>
            <div className="text-neutral-400">Sempre tem coisa nova</div>
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="mx-auto mt-6 max-w-6xl px-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6">
          <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-4">
            {BRANDS.map((b) => (
              <div key={b} className="relative h-7 w-40 opacity-70">
                <Image src={"/brands/" + b + ".png"} alt={b} fill sizes="160px" className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="mx-auto mt-10 max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Últimos Produtos</h2>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar..."
            className="rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3">
              <Link href={"/p/" + p.id} className="group block">
                <div className="overflow-hidden rounded-xl relative h-56 w-full">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3 space-y-1">
                  <div className="text-lg font-medium">{p.name}</div>
                  <div className="text-2xl font-bold">{money(p.price)}</div>
                </div>
              </Link>
              <button
                onClick={() => setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }))}
                className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
              >
                Adicionar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Carrinho */}
      <section className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="mb-3 text-2xl font-semibold">Carrinho</h2>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 text-neutral-400">
            Seu carrinho está vazio.
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <ul className="space-y-2">
              {items.map((i) => (
                <li key={i.id} className="flex items-center justify-between">
                  <span>{i.qty}x {i.name}</span>
                  <span className="font-medium">{money(i.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-neutral-800 pt-3">
              <span className="text-neutral-400">Total</span>
              <span className="text-lg font-semibold">{money(total)}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={finalizarDisabled ? "#" : waLink}
                onClick={finalizarDisabled ? (e) => e.preventDefault() : undefined}
                target={finalizarDisabled ? undefined : "_blank"}
                rel={finalizarDisabled ? undefined : "noreferrer"}
                aria-disabled={finalizarDisabled}
                className={
                  "rounded-lg px-5 py-2 font-medium " +
                  (finalizarDisabled
                    ? "cursor-not-allowed bg-neutral-800 text-neutral-500"
                    : "bg-emerald-600 text-white hover:bg-emerald-500")
                }
              >
                Finalizar no WhatsApp
              </a>
              <a href="#contato" className="rounded-lg border border-neutral-700 px-5 py-2 font-medium text-neutral-200 hover:bg-neutral-800">
                Ver dados de pagamento
              </a>
              <button onClick={clearCart} className="rounded-lg border border-neutral-700 px-5 py-2 font-medium text-neutral-200 hover:bg-neutral-800">
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Pagamento & Contato */}
      <section id="contato" className="mx-auto mt-10 max-w-6xl px-4 pb-14">
        <h2 className="mb-4 text-2xl font-semibold">Pagamento &amp; Contato</h2>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-5">
          <div>
            <p className="text-neutral-400">WhatsApp</p>
            <a href={"https://wa.me/" + WHATSAPP_NUMBER} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
              +55 (44) 98860-6483
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <div className="text-sm text-neutral-400">Chave PIX</div>
              <div className="mt-1 rounded-lg bg-neutral-800 px-4 py-2 font-mono tracking-wider">
                {PIX_KEY}
              </div>
            </div>
            <button
              onClick={copiarPix}
              aria-live="polite"
              className={
                "rounded-lg px-4 py-2 text-sm font-medium transition "
                + (copiado ? "bg-emerald-600 text-white" : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700")
              }
            >
              {copiado ? "Copiado!" : "Copiar chave"}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <input
              placeholder="Seu nome"
              value={cliente.nome}
              onChange={(e) => setCliente((c) => ({ ...c, nome: e.target.value }))}
              className="rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm"
            />
            <input
              placeholder="CEP"
              value={cliente.cep}
              onChange={(e) => setCliente((c) => ({ ...c, cep: e.target.value }))}
              onBlur={buscarCepAuto}
              className="rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm"
            />
            <input
              placeholder="Endereço (rua, nº, bairro, cidade)"
              value={cliente.endereco}
              onChange={(e) => setCliente((c) => ({ ...c, endereco: e.target.value }))}
              className="sm:col-span-3 rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm"
            />
          </div>

          <p className="text-neutral-400">Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.</p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a href="/trocas" className="text-sm text-neutral-300 underline">Política de Trocas</a>
            <a href="/politica-privacidade" className="text-sm text-neutral-300 underline">Política de Privacidade</a>
          </div>
        </div>

        <footer className="mx-auto mt-10 text-center text-neutral-500">
          © {new Date().getFullYear()} Loja da Jane — feito com amor 💚
        </footer>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            PRODUCTS.map((p) => ({
              "@context": "https://schema.org",
              "@type": "Product",
              name: p.name,
              image: BASE_URL + p.image,
              brand: "Loja da Jane",
              offers: {
                "@type": "Offer",
                priceCurrency: "BRL",
                price: p.price.toFixed(2),
                availability: "http://schema.org/InStock",
                url: BASE_URL + "/#catalogo",
              },
            }))
          ),
        }}
      />
    </main>
  );
}
