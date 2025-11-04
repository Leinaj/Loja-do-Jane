"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Product = { id: string; name: string; price: number; image: string };

const BASE_URL = "https://loja-do-jane.vercel.app";
const WHATSAPP_NUMBER = "5544988606483"; // só números
const PIX_KEY = "44988606483";

const PRODUCTS: Product[] = [
  { id: "camiseta-preta",  name: "Camiseta Preta",  price: 69.9,  image: "/images/camiseta-preta.jpg" },
  { id: "camiseta-branca", name: "Camiseta Branca", price: 69.9,  image: "/images/camiseta-branca.jpg" },
  { id: "moletom",         name: "Moletom",         price: 159.9, image: "/images/moletom.jpg" },
  { id: "bone",            name: "Boné",            price: 59.9,  image: "/images/bone.jpg" },
];

const BRANDS = ["nokia", "canon", "samsung", "apple"];
const money = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Page() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [q, setQ] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [cliente, setCliente] = useState({ nome: "", cep: "", endereco: "" });
  const [utm, setUtm] = useState<{ source?: string; medium?: string; campaign?: string }>({});

  // carregar/salvar carrinho
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

  // capturar UTM
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    setUtm({
      source: p.get("utm_source") || undefined,
      medium: p.get("utm_medium") || undefined,
      campaign: p.get("utm_campaign") || undefined,
    });
  }, []);

  // lista filtrada
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PRODUCTS;
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(s));
  }, [q]);

  // itens do carrinho
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

  // montar WhatsApp
  const origem =
    utm.source || utm.medium || utm.campaign
      ? "\n\nOrigem do contato:\n"
        + (utm.source ? `utm_source=${utm.source}\n` : "")
        + (utm.medium ? `utm_medium=${utm.medium}\n` : "")
        + (utm.campaign ? `utm_campaign=${utm.campaign}` : "")
      : "";

  const waMsg =
    "Olá! Segue meu pedido:\n\n" +
    (items.length
      ? items.map((i) => `• ${i.name} x${i.qty} — ${money(i.subtotal)}`).join("\n") +
        `\n\nTotal: ${money(total)}`
      : "Quero fazer um pedido.") +
    (cliente.nome || cliente.cep || cliente.endereco
      ? "\n\nDados do cliente:\n" +
        (cliente.nome ? `Nome: ${cliente.nome}\n` : "") +
        (cliente.cep ? `CEP: ${cliente.cep}\n` : "") +
        (cliente.endereco ? `Endereço: ${cliente.endereco}` : "")
      : "") +
    "\n\nChave PIX: " + PIX_KEY +
    origem;

  const waLink = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(waMsg);

  // ações
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
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await r.json();
      if (!data.erro) {
        const end = [data.logradouro, data.bairro, `${data.localidade} - ${data.uf}`]
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
            <Image
              src="/banner.jpg"
              alt="Banner da Loja da Jane"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold">iPhone 6 <span className="text-emerald-400">Plus</span></h1>
              <p className="mt-2 text-neutral-400">
                Exemplo de banner. Troque o arquivo <code className="bg-neutral-800 px-1 py-0.5 rounded">/public/banner.jpg</code>.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="#catalogo"
                  className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-500"
                >
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
                <Image src={`/brands
