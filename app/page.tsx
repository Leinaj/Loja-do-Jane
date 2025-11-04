"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { id: string; name: string; price: number; image: string };

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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PRODUCTS;
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(s));
  }, [q]);

  function addToCart(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }
  function clearCart() {
    setCart({});
  }

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

  const waMsg =
    "Olá! Segue meu pedido:\n\n" +
    (items.length
      ? items.map((i) => "• " + i.name + " x" + i.qty + " — " + money(i.subtotal)).join("\n") +
        "\n\nTotal: " + money(total)
      : "Quero fazer um pedido.") +
    (cliente.nome || cliente.cep || cliente.endereco
      ? "\n\nDados do cliente:\n" +
        (cliente.nome ? "Nome: " + cliente.nome + "\n" : "") +
        (cliente.cep ? "CEP: " + cliente.cep + "\n" : "") +
        (cliente.endereco ? "Endereço: " + cliente.endereco : "")
      : "") +
    "\n\nChave PIX: " + PIX_KEY;
  const waLink = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(waMsg);

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

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
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

      <section id="home" className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3 sm:p-4">
          <img src="/banner.jpg" alt="Banner" className="h-44 w-full rounded-xl object-cover sm:h-64" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold">iPhone 6 <span className="text-emerald-400">Plus</span></h1>
              <p className="mt-2 text-neutral-400">Exemplo de banner. Troque o arquivo <code className="bg-neutral-800 px-1 py-0.5 rounded">/public/banner.jpg</code>.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="#catalogo" className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-500">Ver produtos</a>
                <a href={waLink} target="_blank" rel="noreferrer" className="rounded-lg border border-neutral-700 px-5 py-2 font-medium text-neutral-200 hover:bg-neutral-800">
                  Finalizar no WhatsApp
                </a>
              </div>
            </div>
            <div className="hidden sm:block" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-neutral-800 bg-[#062333] p-5"><div className="text-xl font-semibold">30 dias para troca</div><div className="text-neutral-400">Sem estresse</div></div>
          <div className="rounded-2xl border border-neutral-800 bg-[#2a1d00] p-5"><div className="text-xl font-semibold">Frete grátis*</div><div className="text-neutral-400">Consulte condições</div></div>
          <div className="rounded-2xl border border-neutral-800 bg-[#2b0b12] p-5"><div className="text-xl font-semibold">Pagamentos seguros</div><div className="text-neutral-400">Pix, Cartão</div></div>
          <div className="rounded-2xl border border-neutral-800 bg-[#072321] p-5"><div className="text-xl font-semibold">Novidades semanais</div><div className="text-neutral-400">Sempre tem coisa nova</div></div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-6xl px-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6">
          <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-4">
            {BRANDS.map((b) => (
              <img key={b} src={"/brands/" + b + ".png"} alt={b} className="h-7 opacity-70" />
            ))}
          </div>
        </div>
      </section>

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
              <div className="overflow-hidden rounded-xl">
                <img src={p.image} alt={p.name} className="h-56 w-full object-cover" />
              </div>
              <div className="mt-3 space-y-1">
                <div className="text-lg font-medium">{p.name}</div>
                <div className="text-2xl font-bold">{money(p.price)}</div>
              </div>
              <button onClick={() => addToCart(p.id)} className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500">
                Adicionar
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="mb-3 text-2xl font-semibold">Carrinho</h2>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 text-neutral-400">Seu carrinho está vazio.</div>
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
              <a href={waLink} target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-500">
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
              <div className="mt-1 rounded-lg bg-neutral-800 px-4 py-2 font-mono tracking-wider">{PIX_KEY}</div>
            </div>
            <button
              onClick={copiarPix}
              className={"rounded-lg px-4 py-2 text-sm font-medium transition " + (copiado ? "bg-emerald-600 text-white" : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700")}
              aria-live="polite"
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
    </main>
  );
}
