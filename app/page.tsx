'use client';

import { useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  img: string; // caminho dentro de /public
};

type Cart = Record<string, number>;

const WHATSAPP_RAW = '5544988606483'; // para link do WhatsApp (só números)
const WHATSAPP_DISPLAY = '+55 (44) 98860-6483';
const PIX_KEY = '44988606483';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const PRODUCTS: Product[] = [
  {
    id: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 69.9,
    oldPrice: 89.9,
    img: '/images/camiseta-preta.jpg', // troque pelo nome do seu arquivo
  },
  {
    id: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 69.9,
    oldPrice: 89.9,
    img: '/images/camiseta-branca.jpg',
  },
  {
    id: 'moletom',
    name: 'Moletom',
    price: 159.9,
    img: '/images/moletom.jpg',
  },
  {
    id: 'bone',
    name: 'Boné',
    price: 59.9,
    img: '/images/bone.jpg',
  },
];

const BENEFITS = [
  { title: '30 dias para troca', desc: 'Sem estresse', bg: 'from-slate-800 to-slate-900' },
  { title: 'Frete grátis*', desc: 'Consulte condições', bg: 'from-amber-900 to-black' },
  { title: 'Pagamentos seguros', desc: 'Pix, Cartão', bg: 'from-rose-900 to-black' },
  { title: 'Novidades semanais', desc: 'Sempre tem coisa nova', bg: 'from-emerald-900 to-black' },
];

const BRANDS = [
  { name: 'Nokia',   logo: '/brands/brand-nokia.png' },
  { name: 'Canon',   logo: '/brands/brand-canon.png' },
  { name: 'Samsung', logo: '/brands/brand-samsung.png' },
  { name: 'Apple',   logo: '/brands/brand-apple.png' },
];

export default function HomePage() {
  const [cart, setCart] = useState<Cart>({});

  const addToCart = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  };
  const removeOne = (id: string) => {
    setCart((c) => {
      const q = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  };
  const clearCart = () => setCart({});

  const items = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id)!;
      return { product, qty, line: product.price * qty };
    });
  }, [cart]);

  const total = items.reduce((acc, i) => acc + i.line, 0);

  const finalizeWhatsApp = () => {
    if (items.length === 0) return;

    const lines: string[] = [];
    lines.push('Olá! Quero finalizar minha compra 🛒');
    lines.push('');
    lines.push('Itens:');
    items.forEach((i) =>
      lines.push(`• ${i.product.name} x${i.qty} — ${currency.format(i.line)}`)
    );
    lines.push('');
    lines.push(`Total: ${currency.format(total)}`);
    lines.push('');
    lines.push(`Chave PIX: ${PIX_KEY}`);
    lines.push('Forma de pagamento: Pix ou Cartão');
    lines.push('');
    lines.push('Podemos combinar entrega/retirada?');

    const waText = encodeURIComponent(lines.join('\n'));
    const link = `https://wa.me/${WHATSAPP_RAW}?text=${waText}`;
    window.open(link, '_blank');
  };

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      alert('Chave PIX copiada!');
    } catch {
      alert('Não foi possível copiar. Copie manualmente: ' + PIX_KEY);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* topo fino com info */}
      <div className="text-xs sm:text-sm bg-neutral-900 text-neutral-400 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap gap-x-6 gap-y-1 justify-between">
          <span>
            Bem-vinda à <b className="text-white">Loja da Jane</b> ✨
          </span>
          <div className="flex gap-4">
            <span>
              Suporte: WhatsApp <a className="text-emerald-400 underline" href={`https://wa.me/${WHATSAPP_RAW}`} target="_blank">{WHATSAPP_DISPLAY}</a>
            </span>
            <span>
              Carrinho: {items.length} {items.length === 1 ? 'item' : 'itens'} — {currency.format(total)}
            </span>
          </div>
        </div>
      </div>

      {/* navbar */}
      <nav className="sticky top-0 z-30 backdrop-blur bg-black/60 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-bold text-lg">
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">u</span>
            <span>commerce</span>
          </div>
          <div className="hidden sm:flex gap-6 text-sm text-neutral-300">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#catalogo" className="hover:text-white">Catálogo</a>
            <a href="#contato" className="hover:text-white">Contato</a>
          </div>
        </div>
      </nav>

      {/* hero / banner */}
      <section id="home" className="max-w-6xl mx-auto px-4 pt-6">
        <div className="bg-neutral-900 rounded-2xl p-4 sm:p-6 border border-neutral-800">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div className="rounded-xl overflow-hidden bg-neutral-800">
              {/* Troque /public/banner.jpg por sua arte */}
              <img src="/banner.jpg" alt="Promoção" className="w-full h-56 sm:h-72 object-cover" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold">
                iPhone 6 <span className="text-emerald-400">Plus</span>
              </h1>
              <p className="text-neutral-400 mt-2">
                Exemplo de banner. Para trocar, substitua o arquivo <code className="px-1 py-0.5 rounded bg-neutral-800 text-neutral-300">/public/banner.jpg</code>.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <a href="#catalogo" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">
                  Ver produtos
                </a>
                <button onClick={finalizeWhatsApp} className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800">
                  Finalizar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* benefícios */}
      <section className="max-w-6xl mx-auto px-4 mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BENEFITS.map((b) => (
          <div key={b.title} className={`rounded-xl border border-neutral-800 p-4 bg-gradient-to-b ${b.bg}`}>
            <div className="text-lg font-medium">{b.title}</div>
            <div className="text-neutral-300">{b.desc}</div>
          </div>
        ))}
      </section>

      {/* marcas */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center">
            {BRANDS.map((b) => (
              <div key={b.name} className="opacity-90 hover:opacity-100 transition">
                <img src={b.logo} alt={b.name} className="h-8 sm:h-10 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* catálogo */}
      <section id="catalogo" className="max-w-6xl mx-auto px-4 mt-10">
        <h2 className="text-2xl font-semibold mb-4">Últimos Produtos</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
              <div className="aspect-[4/3] bg-neutral-800">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="text-neutral-200 text-lg">{p.name}</div>
                <div className="mt-1">
                  <span className="text-xl font-semibold">{currency.format(p.price)}</span>
                  {p.oldPrice && (
                    <span className="ml-2 text-neutral-400 line-through">{currency.format(p.oldPrice)}</span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(p.id)}
                  className="w-full mt-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white py-2"
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* carrinho */}
      <section className="max-w-6xl mx-auto px-4 mt-10">
        <h2 className="text-2xl font-semibold mb-3">Carrinho</h2>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          {items.length === 0 ? (
            <div className="text-neutral-400">Seu carrinho está vazio.</div>
          ) : (
            <>
              <ul className="divide-y divide-neutral-800">
                {items.map(({ product, qty, line }) => (
                  <li key={product.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-neutral-400 text-sm">
                        {qty} x {currency.format(product.price)} = <b className="text-neutral-200">{currency.format(line)}</b>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => removeOne(product.id)}
                        className="px-3 py-1 rounded border border-neutral-700 hover:bg-neutral-800"
                      >
                        −
                      </button>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="px-3 py-1 rounded border border-neutral-700 hover:bg-neutral-800"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-lg">
                  Total: <b>{currency.format(total)}</b>
                </div>
                <div className="flex gap-2">
                  <button onClick={clearCart} className="px-4 py-2 rounded border border-neutral-700 hover:bg-neutral-800">
                    Limpar
                  </button>
                  <button onClick={finalizeWhatsApp} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white">
                    Finalizar no WhatsApp
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* pagamento & contato */}
      <section id="contato" className="max-w-6xl mx-auto px-4 mt-10">
        <h2 className="text-2xl font-semibold mb-3">Pagamento & Contato</h2>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="text-neutral-300">WhatsApp</div>
          <a
            className="block text-emerald-400 underline"
            href={`https://wa.me/${WHATSAPP_RAW}`}
            target="_blank"
          >
            {WHATSAPP_DISPLAY}
          </a>

          <div className="mt-4">
            <div className="text-neutral-300">Chave PIX</div>
            <div className="flex gap-2 mt-1">
              <input
                readOnly
                value={PIX_KEY}
                className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 w-full max-w-xs"
              />
              <button onClick={copyPix} className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800">
                Copiar chave
              </button>
            </div>
          </div>

          <p className="text-neutral-400 mt-4">
            Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
          </p>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 mt-10 py-10 text-neutral-400">
        © {new Date().getFullYear()} Loja da Jane — feito com amor <span className="text-emerald-400">💚</span>
      </footer>
    </main>
  );
}
