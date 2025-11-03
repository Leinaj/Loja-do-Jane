'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

// ====== CONFIG BÁSICA ======
const WHATSAPP_NUMBER = '5544988606483'; // +55 44 98860-6483 (no formato internacional)
const PIX_KEY = '44988606483';

// Se os nomes dos arquivos forem diferentes, troque os caminhos abaixo
const PRODUCTS = [
  {
    id: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 69.9,
    img: '/images/camiseta-preta.jpg', // ex.: 'IMG-20251004-WA0000.jpg'
  },
  {
    id: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 69.9,
    img: '/images/camiseta-branca.jpg', // ex.: 'IMG-20251004-WA0003.jpg'
  },
  {
    id: 'moletom',
    name: 'Moletom',
    price: 159.9,
    img: '/images/moletom.jpg', // ex.: 'file_00000000dbd061f6a.jpg'
  },
  {
    id: 'bone',
    name: 'Boné',
    price: 59.9,
    img: '/images/bone.jpg', // ex.: 'file_00000000ee8071f58.jpg'
  },
] as const;

// ====== HELPERS ======
const money = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type Cart = Record<string, number>;

// ====== PÁGINA ======
export default function Home() {
  const [cart, setCart] = useState<Cart>({});
  const [copied, setCopied] = useState(false);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart]
  );

  const cartLines = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const p = PRODUCTS.find((x) => x.id === id)!;
        return { ...p, qty, lineTotal: p.price * qty };
      });
  }, [cart]);

  const cartTotal = useMemo(
    () => cartLines.reduce((acc, l) => acc + l.lineTotal, 0),
    [cartLines]
  );

  const addToCart = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  const decFromCart = (id: string) =>
    setCart((c) => {
      const next = { ...c, [id]: Math.max((c[id] || 0) - 1, 0) };
      if (next[id] === 0) delete next[id];
      return next;
    });

  const removeFromCart = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  const waHref = useMemo(() => {
    if (cartLines.length === 0)
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Olá! Vim da Loja da Jane.'
      )}`;

    const itemsTxt = cartLines
      .map(
        (l) =>
          `• ${l.name} x${l.qty} — ${money(l.lineTotal)}`
      )
      .join('\n');

    const text = `Olá! Vim da Loja da Jane.%0A%0AQuero finalizar este pedido:%0A${itemsTxt}%0A%0ATotal: ${money(
      cartTotal
    )}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [cartLines, cartTotal]);

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* TOP BAR */}
      <div className="w-full border-b border-zinc-800 text-xs">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
          <div className="opacity-70">Bem-vinda à <b>Loja da Jane</b> ✨</div>
          <div className="flex gap-4 opacity-70">
            <div>Suporte: WhatsApp {WHATSAPP_NUMBER.replace('55', '+55 ')}</div>
            <div>
              Carrinho: {totalItems} {totalItems === 1 ? 'item' : 'itens'} —{' '}
              {money(cartTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* NAV SIMPLES */}
      <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 h-12 flex items-center justify-between">
          <div className="font-semibold tracking-wide">u<span className="text-emerald-500">commerce</span></div>
          <nav className="text-sm flex gap-6 opacity-90">
            <a href="#" className="hover:text-emerald-400">Home</a>
            <a href="#catalogo" className="hover:text-emerald-400">Catálogo</a>
            <a href="#contato" className="hover:text-emerald-400">Contato</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* ===== BANNER ===== */}
        <section className="rounded-xl overflow-hidden border border-zinc-800">
          <div className="relative w-full h-40 md:h-64">
            <Image
              src="/banner.jpg"
              alt="Banner da loja"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/60">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">iPhone 6 <span className="text-emerald-400">Plus</span></h1>
              <p className="text-zinc-300 mt-2">
                Exemplo de banner. Você pode trocar por uma imagem sua em <code className="bg-zinc-800 rounded px-1">/public/banner.jpg</code>.
              </p>
            </div>
            <div className="flex gap-3">
              <a href="#catalogo" className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm">
                Ver produtos
              </a>
              <a
                href={waHref}
                target="_blank"
                className="px-4 py-2 rounded border border-zinc-700 text-sm"
              >
                Finalizar no WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ===== PLAQUINHAS ===== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border p-4 bg-sky-600/15 text-sky-300 border-sky-700/40">
            <div className="font-medium">30 dias para troca</div>
            <div className="text-sm opacity-80">Sem estresse</div>
          </div>
          <div className="rounded-lg border p-4 bg-yellow-600/15 text-yellow-300 border-yellow-700/40">
            <div className="font-medium">Frete grátis*</div>
            <div className="text-sm opacity-80">Consulte condições</div>
          </div>
          <div className="rounded-lg border p-4 bg-rose-600/15 text-rose-300 border-rose-700/40">
            <div className="font-medium">Pagamentos seguros</div>
            <div className="text-sm opacity-80">Pix, Cartão</div>
          </div>
          <div className="rounded-lg border p-4 bg-teal-600/15 text-teal-300 border-teal-700/40">
            <div className="font-medium">Novidades semanais</div>
            <div className="text-sm opacity-80">Sempre tem coisa nova</div>
          </div>
        </section>

        {/* ===== LOGOS MARCAS ===== */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center py-6 rounded-lg border border-zinc-800 bg-zinc-900/40">
          <div className="relative w-28 h-10 opacity-80">
            <Image src="/brands/nokia.png" alt="Nokia" fill className="object-contain" />
          </div>
          <div className="relative w-28 h-10 opacity-80">
            <Image src="/brands/canon.png" alt="Canon" fill className="object-contain" />
          </div>
          <div className="relative w-28 h-10 opacity-80">
            <Image src="/brands/samsung.png" alt="Samsung" fill className="object-contain" />
          </div>
          <div className="relative w-28 h-10 opacity-80">
            <Image src="/brands/apple.png" alt="Apple" fill className="object-contain" />
          </div>
        </section>

        {/* ===== CATÁLOGO ===== */}
        <section id="catalogo" className="space-y-4">
          <h2 className="text-lg font-semibold">Últimos Produtos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900/40">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm opacity-80">{p.name}</div>
                  <div className="font-semibold">{money(p.price)}</div>
                  <button
                    onClick={() => addToCart(p.id)}
                    className="mt-2 w-full text-sm px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CARRINHO ===== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Carrinho</h2>

          {cartLines.length === 0 ? (
            <div className="text-sm opacity-70">Seu carrinho está vazio.</div>
          ) : (
            <div className="space-y-2">
              {cartLines.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between gap-3 p-3 rounded border border-zinc-800 bg-zinc-900/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded overflow-hidden border border-zinc-800">
                      <Image src={l.img} alt={l.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-sm">{l.name}</div>
                      <div className="text-xs opacity-70">{money(l.price)} un.</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decFromCart(l.id)}
                      className="px-2 py-1 rounded border border-zinc-700"
                    >
                      −
                    </button>
                    <div className="w-6 text-center">{l.qty}</div>
                    <button
                      onClick={() => addToCart(l.id)}
                      className="px-2 py-1 rounded border border-zinc-700"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-28 text-right font-medium">
                    {money(l.lineTotal)}
                  </div>

                  <button
                    onClick={() => removeFromCart(l.id)}
                    className="text-xs px-2 py-1 rounded border border-zinc-700"
                  >
                    Remover
                  </button>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                <div className="opacity-80 text-sm">
                  {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                </div>
                <div className="text-lg font-semibold">{money(cartTotal)}</div>
              </div>

              <div className="flex gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Finalizar no WhatsApp
                </a>
                <button
                  onClick={() => setCart({})}
                  className="px-4 py-2 rounded border border-zinc-700"
                >
                  Limpar carrinho
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ===== CONTATO / PAGAMENTO ===== */}
        <section id="contato" className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Pagamento & Contato</h2>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-800 p-4 bg-zinc-900/40">
              <div className="text-sm opacity-70">WhatsApp</div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                className="block mt-1 text-emerald-400 hover:underline"
              >
                +55 (44) 98860-6483
              </a>
            </div>

            <div className="rounded-lg border border-zinc-800 p-4 bg-zinc-900/40">
              <div className="text-sm opacity-70">Chave PIX</div>
              <div className="mt-1 flex items-center gap-3">
                <code className="bg-zinc-800 px-2 py-1 rounded">{PIX_KEY}</code>
                <button
                  onClick={copyPix}
                  className="text-xs px-2 py-1 rounded border border-zinc-700"
                >
                  {copied ? 'Copiado!' : 'Copiar chave'}
                </button>
              </div>
              <div className="text-xs opacity-60 mt-2">
                Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Loja da Jane — feito com amor 💚
        </footer>
      </div>
    </main>
  );
}
