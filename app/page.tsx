"use client";

import { useMemo, useState } from "react";

// ========= Config =========
const WHATSAPP_NUMBER = "5544988606483"; // só números com DDI+DDD
const PIX_KEY = "44988606483";

// ========= Tipos =========
type Product = {
  id: string;
  name: string;
  price: number; // em reais
  image: string; // caminho em /public
};

// ========= Dados =========
// Coloque suas imagens dentro de /public/images com esses nomes.
// Se já usa outros nomes, só troque os paths abaixo.
const PRODUCTS: Product[] = [
  {
    id: "camiseta-preta",
    name: "Camiseta Preta",
    price: 69.9,
    image: "/images/camiseta-preta.jpg",
  },
  {
    id: "camiseta-branca",
    name: "Camiseta Branca",
    price: 69.9,
    image: "/images/camiseta-branca.jpg",
  },
  {
    id: "moletom",
    name: "Moletom",
    price: 159.9,
    image: "/images/moletom.jpg",
  },
  {
    id: "bone",
    name: "Boné",
    price: 59.9,
    image: "/images/bone.jpg",
  },
];

const PRODUCTS_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

// ========= Utils =========
const money = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ========= Página =========
export default function Page() {
  // carrinho: id -> quantidade
  const [cart, setCart] = useState<Record<string, number>>({});
  const [copiado, setCopiado] = useState(false);

  function addToCart(id: string) {
    setCart((old) => ({ ...old, [id]: (old[id] ?? 0) + 1 }));
  }

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const p = PRODUCTS_BY_ID[id];
        return {
          product: p,
          qty,
          subtotal: p.price * qty,
        };
      });
  }, [cart]);

  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cartItems.reduce((acc, i) => acc + i.subtotal, 0);

  const waText = encodeURIComponent(
    `Pedido - Loja da Jane\n` +
      cartItems.map((i) => `${i.qty}x ${i.product.name} — ${money(i.subtotal)}`).join("\n") +
      `\nTotal: ${money(cartTotal)}\n\nChave PIX: ${PIX_KEY}`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  async function copiarPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
    } catch {
      // fallback (navegadores antigos)
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
      {/* Barra de topo */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 text-[13px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <span>
            Bem-vinda à <b>Loja da Jane</b> ✨
          </span>
          <div className="flex flex-wrap items-center gap-4 text-neutral-300">
            <span>
              Suporte: WhatsApp{" "}
              <a
                className="text-emerald-400 hover:underline"
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
              >
                +55 44 98860-6483
              </a>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              Carrinho: {cartCount} {cartCount === 1 ? "item" : "itens"} —{" "}
              {money(cartTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-neutral-800 bg-neutral-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-lg font-semibold">
            <span className="text-emerald-400">u</span>commerce
          </div>
          <ul className="flex items-center gap-6 text-sm text-neutral-300">
            <li>
              <a className="hover:text-white" href="#home">
                Home
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#catalogo">
                Catálogo
              </a>
            </li>
            <li>
              <a className="hover:text-white" href="#contato">
                Contato
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3 sm:p-4">
          <img
            src="/banner.jpg"
            alt="Banner de promoção"
            className="h-44 w-full rounded-xl object-cover sm:h-64"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold">
                iPhone 6 <span className="text-emerald-400">Plus</span>
              </h1>
              <p className="mt-2 text-neutral-400">
                Exemplo de banner. Para trocar, substitua o arquivo{" "}
                <code className="rounded bg-neutral-800 px-1 py-0.5">
                  /public/banner.jpg
                </code>
                .
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="#catalogo"
                  className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-500"
                >
                  Ver produtos
                </a>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-neutral-700 px-5 py-2 font-medium text-neutral-200 hover:bg-neutral-800"
                >
                  Finalizar no WhatsApp
                </a>
              </div>
            </div>
            <div className="hidden sm:block">
              {/* Espaço para destacar algo no futuro */}
            </div>
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
            <img src="/brands/nokia.svg" alt="Nokia" className="h-7 opacity-70" />
            <img src="/brands/canon.svg" alt="Canon" className="h-7 opacity-70" />
            <img src="/brands/samsung.svg" alt="Samsung" className="h-7 opacity-70" />
            <img src="/brands/apple.svg" alt="Apple" className="h-7 opacity-70" />
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="mb-4 text-2xl font-semibold">Últimos Produtos</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-56 w-full object-cover"
                />
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-lg font-medium">{p.name}</div>
                <div className="text-2xl font-bold">{money(p.price)}</div>
              </div>

              <button
                onClick={() => addToCart(p.id)}
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

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 text-neutral-400">
            Seu carrinho está vazio.
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <ul className="space-y-2">
              {cartItems.map((i) => (
                <li key={i.product.id} className="flex items-center justify-between">
                  <span>
                    {i.qty}x {i.product.name}
                  </span>
                  <span className="font-medium">{money(i.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-neutral-800 pt-3">
              <span className="text-neutral-400">Total</span>
              <span className="text-lg font-semibold">{money(cartTotal)}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-500"
              >
                Finalizar no WhatsApp
              </a>
              <a
                href="#contato"
                className="rounded-lg border border-neutral-700 px-5 py-2 font-medium text-neutral-200 hover:bg-neutral-800"
              >
                Ver dados de pagamento
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Pagamento & Contato */}
      <section id="contato" className="mx-auto mt-10 max-w-6xl px-4 pb-14">
        <h2 className="mb-4 text-2xl font-semibold">Pagamento &amp; Contato</h2>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <p className="text-neutral-400">WhatsApp</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline"
          >
            +55 (44) 98860-6483
          </a>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-neutral-800 px-4 py-2 font-mono tracking-wider">
              {PIX_KEY}
            </div>

            <button
              onClick={copiarPix}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                copiado
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              }`}
              aria-live="polite"
            >
              {copiado ? "Copiado!" : "Copiar chave"}
            </button>
          </div>

          <p className="mt-4 text-neutral-400">
            Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
          </p>
        </div>

        <footer className="mx-auto mt-10 text-center text-neutral-500">
          © {new Date().getFullYear()} Loja da Jane — feito com amor 💚
        </footer>
      </section>
    </main>
  );
}
