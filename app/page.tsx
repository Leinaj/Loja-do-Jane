'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

/** CONFIGURAÇÕES RÁPIDAS */
const STORE_NAME = 'Loja da Jane';
const WHATSAPP_NUMBER = '5544988606483'; // 55 + DDD + número, só dígitos
const PIX_KEY = '44988606483';

/** LOGOS DE MARCAS
 * Coloque os arquivos em /public com esses nomes:
 * - /nokia.png  - /canon.png  - /samsung.jpeg  - /apple.png
 */
const BRANDS = [
  { alt: 'Nokia',   src: '/nokia.png' },
  { alt: 'Canon',   src: '/canon.png' },
  { alt: 'Samsung', src: '/samsung.jpeg' },
  { alt: 'Apple',   src: '/apple.png' },
];

/** PRODUTOS
 * Ajuste as imagens que você já tem em /public/images/
 * (mantenha os nomes que você está usando hoje, se forem diferentes)
 */
type Product = {
  id: string;
  name: string;
  price: number; // em reais
  image: string; // caminho no /public
};

const PRODUCTS: Product[] = [
  {
    id: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 69.9,
    image: '/images/camiseta-preta.jpg',
  },
  {
    id: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 69.9,
    image: '/images/camiseta-branca.jpg',
  },
  {
    id: 'moletom',
    name: 'Moletom',
    price: 159.9,
    image: '/images/moletom.jpg',
  },
  {
    id: 'bone',
    name: 'Boné',
    price: 59.9,
    image: '/images/bone.jpg',
  },
];

type Cart = Record<string, number>;

export default function Page() {
  const [cart, setCart] = useState<Cart>({});

  const total = useMemo(() => {
    return PRODUCTS.reduce((sum, p) => {
      const q = cart[p.id] || 0;
      return sum + q * p.price;
    }, 0);
  }, [cart]);

  const itemsText = useMemo(() => {
    const lines = PRODUCTS
      .filter((p) => (cart[p.id] || 0) > 0)
      .map((p) => `• ${p.name} x ${cart[p.id]} — R$ ${p.price.toFixed(2)}`);
    return lines.join('%0A');
  }, [cart]);

  function addItem(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }

  function removeItem(id: string) {
    setCart((c) => {
      const q = (c[id] || 0) - 1;
      const next = { ...c };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  }

  function openWhatsAppCheckout() {
    const hasItems = Object.values(cart).some((q) => q > 0);
    if (!hasItems) return;

    const text =
      `Olá! Quero finalizar meu pedido na *${STORE_NAME}*:%0A%0A` +
      `${itemsText}%0A%0A` +
      `*Total:* R$ ${total.toFixed(2)}%0A%0A` +
      `Forma de pagamento: PIX (${PIX_KEY}) ou combinar no WhatsApp.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank');
  }

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY);
    alert('Chave PIX copiada!');
  }

  return (
    <main className="min-h-dvh">
      {/* Faixa de topo */}
      <div className="w-full bg-neutral-800 text-neutral-300 text-sm">
        <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Bem-vinda à <strong className="text-neutral-100">{STORE_NAME}</strong>
          </span>
          <span className="text-neutral-400">
            Suporte: WhatsApp <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-emerald-400 underline">
              +55 (44) 98860-6483
            </a>
          </span>
          <span className="text-neutral-400">
            Carrinho: {Object.values(cart).reduce((a, b) => a + b, 0)} itens — R$ {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-10 backdrop-blur bg-neutral-900/90 border-b border-neutral-800">
        <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="font-semibold text-lg">
            <span className="text-emerald-400">u</span>commerce
          </div>
          <ul className="flex gap-6 text-neutral-300">
            <li><a className="hover:text-emerald-400" href="#home">Home</a></li>
            <li><a className="hover:text-emerald-400" href="#catalogo">Catálogo</a></li>
            <li><a className="hover:text-emerald-400" href="#contato">Contato</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section id="home" className="mx-auto max-w-6xl px-4 pt-8">
        <div className="rounded-2xl bg-neutral-800 border border-neutral-700 p-4 sm:p-6">
          <div className="rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900">
            <Image
              src="/banner.jpg"
              alt="Banner"
              width={1200}
              height={420}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          <div className="mt-6">
            <h1 className="text-3xl sm:text-4xl font-semibold">
              iPhone 6 <span className="text-emerald-400">Plus</span>
            </h1>
            <p className="mt-2 text-neutral-300">
              Exemplo de banner. Você pode trocar por uma imagem sua em
              <span className="px-2 py-1 rounded bg-neutral-900/60 border border-neutral-700 ml-2">
                /public/banner.jpg
              </span>.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#catalogo" className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-3 font-medium">
                Ver produtos
              </a>
              <button
                onClick={openWhatsAppCheckout}
                className="inline-flex items-center justify-center rounded-lg border border-neutral-600 hover:border-neutral-500 px-5 py-3 font-medium"
              >
                Finalizar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cards de vantagens */}
      <section className="mx-auto max-w-6xl px-4 mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard title="30 dias para troca" text="Sem estresse" className="bg-cyan-950/50 border-cyan-900/50" />
        <FeatureCard title="Frete grátis*" text="Consulte condições" className="bg-amber-950/40 border-amber-900/50" />
        <FeatureCard title="Pagamentos seguros" text="Pix, Cartão" className="bg-rose-950/40 border-rose-900/50" />
        <FeatureCard title="Novidades semanais" text="Sempre tem coisa nova" className="bg-teal-950/40 border-teal-900/50" />
      </section>

      {/* Marcas */}
      <section className="mx-auto max-w-6xl px-4 mt-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
            {BRANDS.map((b) => (
              <div key={b.alt} className="relative h-16 sm:h-20 opacity-90">
                <Image src={b.src} alt={b.alt} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="mx-auto max-w-6xl px-4 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Últimos Produtos</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((p) => {
            const qty = cart[p.id] || 0;
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/40">
                <div className="relative aspect-[4/3]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="p-4 border-t border-neutral-800">
                  <div className="font-medium text-lg">{p.name}</div>
                  <div className="mt-1 text-xl font-semibold">R$ {p.price.toFixed(2)}</div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => addItem(p.id)}
                      className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-medium"
                    >
                      Adicionar
                    </button>
                    {qty > 0 && (
                      <button
                        onClick={() => removeItem(p.id)}
                        className="rounded-lg border border-neutral-600 hover:border-neutral-500 px-4 py-2 font-medium"
                      >
                        -1
                      </button>
                    )}
                  </div>

                  {qty > 0 && (
                    <div className="mt-2 text-sm text-neutral-400">
                      No carrinho: <span className="text-neutral-200 font-medium">{qty}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Carrinho simples */}
      <section className="mx-auto max-w-6xl px-4 mt-10">
        <h3 className="text-2xl font-semibold">Carrinho</h3>
        <div className="mt-3 text-neutral-300">
          {Object.keys(cart).length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <ul className="space-y-1">
              {PRODUCTS.filter((p) => (cart[p.id] || 0) > 0).map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <span>{p.name} x {cart[p.id]}</span>
                  <span>R$ {(p.price * (cart[p.id] || 0)).toFixed(2)}</span>
                </li>
              ))}
              <li className="pt-2 border-t border-neutral-800 flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </li>
            </ul>
          )}

          <div className="mt-4">
            <button
              disabled={Object.keys(cart).length === 0}
              onClick={openWhatsAppCheckout}
              className="rounded-lg bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 px-5 py-3 font-medium"
            >
              Finalizar no WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Pagamento & Contato */}
      <section id="contato" className="mx-auto max-w-6xl px-4 mt-10 mb-16">
        <h3 className="text-2xl font-semibold">Pagamento & Contato</h3>

        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <div className="text-neutral-400">WhatsApp</div>
            <a
              className="mt-1 inline-block text-emerald-400 underline text-lg"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
            >
              +55 (44) 98860-6483
            </a>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <div className="text-neutral-400">Chave PIX</div>
            <div className="mt-2 flex gap-2">
              <input
                readOnly
                value={PIX_KEY}
                className="w-full rounded-lg bg-neutral-950 border border-neutral-700 px-3 py-2"
              />
              <button
                onClick={copyPix}
                className="whitespace-nowrap rounded-lg border border-neutral-600 hover:border-neutral-500 px-4 py-2 font-medium"
              >
                Copiar chave
              </button>
            </div>
            <p className="mt-2 text-neutral-400">
              Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="border-t border-neutral-800 py-10 text-center text-neutral-400">
        © {new Date().getFullYear()} {STORE_NAME} — feito com amor <span className="text-emerald-500">💚</span>
      </footer>
    </main>
  );
}

function FeatureCard({
  title,
  text,
  className = '',
}: {
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${className}`}>
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-neutral-300 mt-1">{text}</div>
    </div>
  );
}
