'use client';

import { useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;     // preço atual
  oldPrice?: number; // preço antigo (riscado)
  image: string;     // caminho em /public/images
  brand?: string;
  tags?: string[];   // ex.: ["novo", "promo"]
};

/** === CONFIGURÁVEIS RÁPIDOS === */
const WHATSAPP_E164 = '5544988606483';
const PIX_KEY = '44988606483';

// ATUALIZE AQUI os caminhos das suas fotos em /public/images
const PRODUCTS: Product[] = [
  {
    id: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 69.9,
    oldPrice: 89.9,
    image: '/images/camiseta-preta.jpg', // troque pelo nome real do arquivo
    brand: 'Jane',
    tags: ['promo'],
  },
  {
    id: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 69.9,
    image: '/images/camiseta-branca.jpg',
    brand: 'Jane',
    tags: ['novo'],
  },
  {
    id: 'moletom',
    name: 'Moletom',
    price: 159.9,
    oldPrice: 179.9,
    image: '/images/moletom.jpg',
    brand: 'Jane',
  },
  {
    id: 'bone',
    name: 'Boné',
    price: 59.9,
    image: '/images/bone.jpg',
    brand: 'Jane',
  },
];

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});

  const productById = useMemo(() => {
    const map: Record<string, Product> = {};
    PRODUCTS.forEach(p => (map[p.id] = p));
    return map;
  }, []);

  const items = useMemo(
    () => Object.entries(cart).filter(([, q]) => q > 0),
    [cart]
  );

  const total = useMemo(
    () =>
      items.reduce((sum, [id, q]) => {
        const p = productById[id];
        return sum + p.price * q;
      }, 0),
    [items, productById]
  );

  function add(id: string) {
    setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }
  function remove(id: string) {
    setCart(prev => {
      const curr = prev[id] ?? 0;
      const next = { ...prev };
      if (curr <= 1) delete next[id];
      else next[id] = curr - 1;
      return next;
    });
  }
  function clearCart() {
    setCart({});
  }

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY).then(() =>
      alert('Chave Pix copiada!')
    );
  }

  function whatsCheckout() {
    if (!items.length) return;
    const list = items
      .map(([id, q]) => {
        const p = productById[id];
        const line = `- ${p.name} x${q} — R$ ${p.price.toFixed(2)}`;
        return line;
      })
      .join('\n');

    const msg = `Olá! Quero finalizar esse pedido:%0A%0A${list}%0A%0ATotal: R$ ${total
      .toFixed(2)
      .replace('.', ',')}.%0AChave Pix: ${PIX_KEY}`;
    const url = `https://wa.me/${WHATSAPP_E164}?text=${msg}`;
    window.open(url, '_blank');
  }

  return (
    <main>
      {/* TOP BAR */}
      <div className="bg-zinc-800 border-b border-zinc-700">
        <div className="container flex h-10 items-center justify-between text-xs">
          <div className="opacity-80">
            Bem-vinda à <strong>Loja da Jane</strong> ✨
          </div>
          <div className="flex gap-4 opacity-80">
            <span>Suporte: WhatsApp</span>
            <span>Pix: {PIX_KEY}</span>
          </div>
        </div>
      </div>

      {/* NAV */}
      <header className="bg-zinc-900 sticky top-0 z-40 border-b border-zinc-800/80 backdrop-blur">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 grid place-items-center font-bold">
              U
            </div>
            <span className="text-lg font-semibold">commerce</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#">Home</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#contato">Contato</a>
          </nav>

          <div className="text-sm">
            <span className="badge">Carrinho: R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </header>

      {/* HERO / BANNER */}
      <section className="border-b border-zinc-800">
        <div className="container py-10 md:py-16 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              iPhone 6 <span className="text-emerald-400">Plus</span>
            </h1>
            <p className="mt-3 text-zinc-300/90">
              Exemplo de banner. Você pode trocar por uma imagem sua aqui.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#catalogo" className="btn btn-primary">Ver produtos</a>
              <button className="btn btn-ghost" onClick={whatsCheckout}>
                Finalizar no WhatsApp
              </button>
            </div>
          </div>
          {/* imagem do banner — use sua própria se quiser */}
          <div className="hidden md:block">
            <img
              src="/images/camiseta-preta.jpg"
              alt="Banner"
              className="w-full h-72 object-cover rounded-2xl border border-zinc-700"
            />
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="container py-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '↩️', title: '30 dias para troca' },
          { icon: '🚚', title: 'Frete grátis*' },
          { icon: '🔒', title: 'Pagamentos seguros' },
          { icon: '🎁', title: 'Novidades toda semana' },
        ].map((f, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className="text-2xl">{f.icon}</div>
            <div className="font-medium">{f.title}</div>
          </div>
        ))}
      </section>

      {/* LATEST PRODUCTS */}
      <section id="catalogo" className="container py-8">
        <h2 className="section-title">Últimos Produtos</h2>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRODUCTS.map(p => (
            <article key={p.id} className="card overflow-hidden">
              <div className="aspect-[4/5] bg-zinc-700/40">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{p.name}</h3>
                  <div className="flex gap-1">
                    {p.tags?.map(t => (
                      <span key={t} className="badge">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-1 text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="text-emerald-400 font-semibold">
                      R$ {p.price.toFixed(2)}
                    </span>
                    {p.oldPrice && (
                      <span className="text-zinc-400 line-through">
                        R$ {p.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="btn btn-primary w-full" onClick={() => add(p.id)}>
                    Adicionar
                  </button>
                  {cart[p.id] ? (
                    <button className="btn btn-ghost" title="Remover 1" onClick={() => remove(p.id)}>
                      −
                    </button>
                  ) : null}
                </div>
                {cart[p.id] ? (
                  <div className="mt-2 text-xs opacity-80">
                    No carrinho: {cart[p.id]}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BRAND STRIP (pode trocar por logos) */}
      <section className="container py-8">
        <div className="card p-4 grid grid-cols-2 md:grid-cols-4 gap-4 place-items-center text-zinc-300">
          <span className="font-semibold opacity-80">NOKIA</span>
          <span className="font-semibold opacity-80">Canon</span>
          <span className="font-semibold opacity-80">Samsung</span>
          <span className="font-semibold opacity-80">Apple</span>
        </div>
      </section>

      {/* CART + PAGAMENTO */}
      <section id="contato" className="container py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-4">
            <h3 className="text-lg font-semibold">Carrinho</h3>
            {!items.length ? (
              <p className="mt-2 text-sm opacity-80">Seu carrinho está vazio.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {items.map(([id, q]) => {
                  const p = productById[id];
                  return (
                    <li key={id} className="flex items-center justify-between">
                      <span>
                        {p.name} <span className="opacity-60">x{q}</span>
                      </span>
                      <span>R$ {(p.price * q).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-3 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="btn btn-primary"
                disabled={!items.length}
                onClick={whatsCheckout}
              >
                Finalizar no WhatsApp
              </button>
              <button
                className="btn btn-ghost"
                disabled={!items.length}
                onClick={clearCart}
              >
                Limpar carrinho
              </button>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-lg font-semibold">Pagamento & Contato</h3>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <div className="opacity-80">WhatsApp:</div>
                <a
                  className="text-emerald-400"
                  href={`https://wa.me/${WHATSAPP_E164}`}
                  target="_blank"
                >
                  +55 (44) 98860-6483
                </a>
              </div>
              <div>
                <div className="opacity-80">Chave Pix:</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{PIX_KEY}</span>
                  <button className="btn btn-ghost" onClick={copyPix}>
                    Copiar chave
                  </button>
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-700">
                <div className="opacity-80">Aceitamos:</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="badge">Pix</span>
                  <span className="badge">Cartão</span>
                  <span className="badge">Dinheiro</span>
                  <span className="badge">Entrega combinada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800">
        <div className="container py-6 text-sm opacity-80">
          © {new Date().getFullYear()} Loja da Jane — todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}
