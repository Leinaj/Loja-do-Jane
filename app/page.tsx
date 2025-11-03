'use client';

import { useMemo, useState } from 'react';

type Product = {
  id: string;
  title: string;
  price: number;
  img: string;
  desc: string;
  category: string;
};

const PRODUCTS: Product[] = [
  {
    id: 'camiseta-oversized',
    title: 'Camiseta Oversized',
    price: 89.9,
    img: 'https://images.unsplash.com/photo-1520975922240-8b456906c813?w=800&q=80&auto=format&fit=crop',
    desc: 'Algodão premium, caimento oversized, unissex',
    category: 'Roupas',
  },
  {
    id: 'tenis-street',
    title: 'Tênis Street',
    price: 219.9,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop',
    desc: 'Conforto + estilo para o dia a dia',
    category: 'Calçados',
  },
  {
    id: 'mochila-urbana',
    title: 'Mochila Urbana',
    price: 159.9,
    img: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&q=80&auto=format&fit=crop',
    desc: 'Resistente, várias divisórias, notebook até 15”',
    category: 'Acessórios',
  },
  {
    id: 'fone-bluetooth',
    title: 'Fone Bluetooth',
    price: 129.9,
    img: 'https://images.unsplash.com/photo-1518441318581-36ee7e1b21d5?w=800&q=80&auto=format&fit=crop',
    desc: 'Som limpo, bateria longa, microfone HD',
    category: 'Eletrônicos',
  },
];

type Cart = Record<string, number>;
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Home() {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Cart>({});
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<'Todas' | 'Roupas' | 'Calçados' | 'Acessórios' | 'Eletrônicos'>('Todas');

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p =>
      (category === 'Todas' || p.category === category) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) ||
       p.desc.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, category]);

  const items = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = PRODUCTS.find(p => p.id === id)!;
        return { product, qty, subtotal: product.price * qty };
      })
      .filter(i => i.qty > 0);
  }, [cart]);

  const total = items.reduce((s, i) => s + i.subtotal, 0);

  function add(id: string) {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setOpen(true);
  }
  function inc(id: string) {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function dec(id: string) {
    setCart(c => {
      const v = Math.max((c[id] || 0) - 1, 0);
      const copy = { ...c, [id]: v };
      if (v === 0) delete copy[id];
      return copy;
    });
  }
  function clear() {
    setCart({});
  }

  function checkoutWhatsApp() {
    if (!items.length) return;
    const textoItens = items
      .map(i => `• ${i.product.title} x${i.qty} — ${money.format(i.subtotal)}`)
      .join('\n');
    const msg = `Olá! Quero finalizar meu pedido:\n\n${textoItens}\n\nTotal: ${money.format(total)}`;
    // >>> TROQUE PELO SEU NÚMERO: 554499999999 (55 + DDD + número SEM espaços)
    const phone = '55SEU_NUMERO_AQUI';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <div className="text-xl font-bold">🛍️ Loja da Jane</div>
          <div className="ml-auto flex items-center gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar produto…"
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/20"
            />
            <select
              className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-sm"
              value={category}
              onChange={e => setCategory(e.target.value as any)}
            >
              <option>Todas</option>
              <option>Roupas</option>
              <option>Calçados</option>
              <option>Acessórios</option>
              <option>Eletrônicos</option>
            </select>

            <button
              onClick={() => setOpen(true)}
              className="relative rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15 active:scale-95 transition"
            >
              Carrinho
              {items.length > 0 && (
                <span className="absolute -right-2 -top-2 text-xs bg-emerald-500 text-black rounded-full px-1.5">
                  {items.reduce((s, i) => s + i.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Destaques</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(p => (
            <div key={p.id} className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="text-sm text-white/60">{p.category}</div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-white/70">{p.desc}</div>
                <div className="mt-2 text-lg font-semibold">{money.format(p.price)}</div>
                <button
                  onClick={() => add(p.id)}
                  className="mt-2 rounded-xl bg-emerald-500 text-black font-medium px-4 py-2 hover:brightness-95 active:scale-95 transition"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Drawer do carrinho */}
      {open && (
        <div className="fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[88%] sm:w-[420px] bg-neutral-950 border-l border-white/10 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border
