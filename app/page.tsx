'use client';

import { useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number; // BRL
  image?: string;
};

const products: Product[] = [
  { id: 'camiseta-preta',  name: 'Camiseta Preta',  price: 89.9,  image: '/images/camiseta-preta.jpg' },
  { id: 'camiseta-branca', name: 'Camiseta Branca', price: 89.9,  image: '/images/camiseta-branca.jpg' },
  { id: 'moleton',         name: 'Moletom',         price: 159.9, image: '/images/moletom.jpg' },
  { id: 'bone',            name: 'Boné',            price: 59.9,  image: '/images/bone.jpg' }
];

// Seu WhatsApp (DDI 55 + DDD 44 + número, só dígitos)
const phone = '5544988606483';

// (Opcional) sua chave Pix para exibir na tela quando o cliente escolher Pix
const pixKey = 'SUA-CHAVE-PIX-AQUI'; // ex.: CPF, email ou chave aleatória

const money = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [payment, setPayment] = useState<'Pix' | 'Cartão (link)' | 'Dinheiro/Retirada' | ''>('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const add = (id: string) =>
    setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  const remove = (id: string) =>
    setCart(prev => {
      const qty = (prev[id] ?? 0) - 1;
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const clear = () => setCart({});

  const items = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const p = products.find(x => x.id === id)!;
      return { ...p, qty, subtotal: p.price * qty };
    });
  }, [cart]);

  const total = items.reduce((sum, it) => sum + it.subtotal, 0);

  const message = useMemo(() => {
    if (!items.length) return 'Olá! Quero informações sobre os produtos da Loja da Jane.';

    const lines = [
      '*Novo pedido - Loja da Jane*',
      '',
      ...items.map(it => `• ${it.name} x${it.qty} — ${money(it.subtotal)}`),
      '',
      `*Total:* ${money(total)}`,
      payment ? `*Pagamento:* ${payment}` : '*Pagamento:* (não selecionado)',
      name ? `*Nome:* ${name}` : '',
      address ? `*Endereço:* ${address}` : '',
      note ? `*Observações:* ${note}` : ''
    ].filter(Boolean);

    return lines.join('\n');
  }, [items, total, payment, name, address, note]);

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* Catálogo */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Catálogo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="rounded-2xl border border-white/10 bg-[var(--card)] p-4">
              <div className="mb-3 aspect-video w-full overflow-hidden rounded-xl bg-white/5 grid place-items-center">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500">Imagem</span>
                )}
              </div>

              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-400">{money(p.price)}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => add(p.id)}
                  className="flex-1 rounded-xl bg-[var(--primary)] px-3 py-2 text-black font-semibold"
                >
                  Adicionar
                </button>
                {cart[p.id] ? (
                  <button
                    onClick={() => remove(p.id)}
                    className="rounded-xl border border-white/15 px-3 py-2 text-sm"
                  >
                    Remover
                  </button>
                ) : null}
              </div>

              {cart[p.id] ? (
                <p className="mt-2 text-xs text-gray-400">No carrinho: {cart[p.id]}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* Carrinho + Pagamento */}
      <aside className="h-max rounded-2xl border border-white/10 bg-[var(--card)] p-4 sticky top-6">
        <h2 className="text-lg font-semibold">Carrinho</h2>

        {!items.length ? (
          <p className="mt-2 text-sm text-gray-400">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="mt-3 space-y-2">
              {items.map(it => (
                <li key={it.id} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm">{it.name} <span className="text-gray-400">x{it.qty}</span></p>
                    <p className="text-xs text-gray-400">{money(it.subtotal)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => remove(it.id)} className="rounded-lg border border-white/15 px-2 py-1 text-xs">−</button>
                    <button onClick={() => add(it.id)}    className="rounded-lg border border-white/15 px-2 py-1 text-xs">+</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">Total</span>
              <strong className="text-base">{money(total)}</strong>
            </div>

            {/* Dados do cliente */}
            <div className="mt-4 grid gap-2">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome (opcional)"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Endereço para entrega (opcional)"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Observações (ex.: tamanho, cor...)"
                className="min-h-[80px] w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none"
              />
            </div>

            {/* Pagamento */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Forma de pagamento</p>

              <div className="grid gap-2">
                {(['Pix', 'Cartão (link)', 'Dinheiro/Retirada'] as const).map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="payment"
                      value={opt}
                      checked={payment === opt}
                      onChange={() => setPayment(opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>

              {payment === 'Pix' && pixKey && (
                <div className="mt-2 rounded-xl border border-white/15 p-3 text-xs text-gray-300">
                  <p><strong>Chave Pix:</strong> {pixKey}</p>
                  <p className="text-gray-400 mt-1">Após enviar o pedido no Whats, você manda o comprovante.</p>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-2">
              <a
                href={waUrl}
                target="_blank"
                className="rounded-xl bg-[var(--primary)] px-4 py-3 text-center font-semibold text-black"
              >
                Finalizar no WhatsApp
              </a>
              <button onClick={clear} className="rounded-xl border border-white/15 px-4 py-2 text-sm">
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
