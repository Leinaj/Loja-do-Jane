'use client';

import { useState } from 'react';

type Product = { id: string; name: string; price: number; image: string };

const PIX_KEY = '44988606483';
const WHATS_NUM = '5544988606483'; // +55 44 98860-6483

const PRODUCTS: Product[] = [
  { id: 'camiseta-preta',  name: 'Camiseta Preta',  price: 69.9,  image: '/images/camiseta-preta.jpg' },
  { id: 'camiseta-branca', name: 'Camiseta Branca', price: 69.9,  image: '/images/camiseta-branca.jpg' },
  { id: 'moletom',         name: 'Moletom',         price: 159.9, image: '/images/moletom.jpg' },
  { id: 'bone',            name: 'Boné',            price: 59.9,  image: '/images/bone.jpg' },
];

function money(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});

  const add = (id: string) => setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const remove = (id: string) =>
    setCart(c => {
      const next = { ...c };
      const q = (next[id] ?? 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const items = Object.entries(cart).map(([id, q]) => ({ p: PRODUCTS.find(x => x.id === id)!, q }));
  const total = items.reduce((s, i) => s + i.p.price * i.q, 0);

  const waText = encodeURIComponent(
    `Olá! Quero finalizar um pedido:\n` +
    items.map(i => `• ${i.p.name} – ${i.q} × ${money(i.p.price)}`).join('\n') +
    `\n\nTotal: ${money(total)}\nChave PIX: ${PIX_KEY}`
  );
  const waLink = `https://wa.me/${WHATS_NUM}?text=${waText}`;

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, Arial' }}>
      <header style={{ padding: '24px 16px' }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Loja da Jane</h1>
        <p style={{ margin: '6px 0 0', opacity: 0.8 }}>Catálogo com carrinho ✅</p>
      </header>

      <main style={{ padding: '0 16px 32px' }}>
        <h2 style={{ fontSize: 18, margin: '0 0 10px' }}>Catálogo</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{ background: '#151515', border: '1px solid #222', borderRadius: 12, padding: 12 }}>
              <div style={{ height: 120, background: '#0f0f0f', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ display: 'block' }}>{p.name}</strong>
                  <span style={{ fontSize: 14, opacity: 0.85 }}>{money(p.price)}</span>
                </div>
                <button
                  onClick={() => add(p.id)}
                  style={{ background: '#2d6cdf', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: 8, cursor: 'pointer' }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 18, margin: '18px 0 8px' }}>Carrinho</h2>

        {items.length === 0 ? (
          <p style={{ opacity: 0.75 }}>Seu carrinho está vazio.</p>
        ) : (
          <div style={{ background: '#151515', border: '1px solid #222', borderRadius: 12, padding: 12 }}>
            {items.map(({ p, q }) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #333' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>{q} × {money(p.price)}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => remove(p.id)} style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', padding: '6px 10px', borderRadius: 8 }}>-</button>
                  <button onClick={() => add(p.id)}     style={{ background: '#2d6cdf', color: '#fff', border: 'none',              padding: '6px 10px', borderRadius: 8 }}>+</button>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 700 }}>
              <span>Total</span><span>{money(total)}</span>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <a href={waLink} target="_blank" rel="noreferrer"
                 style={{ background: '#2d6cdf', color: '#fff', borderRadius: 8, padding: '8px 10px', textDecoration: 'none' }}>
                Pedir no WhatsApp
              </a>
              <button onClick={() => alert(`Chave PIX: ${PIX_KEY}`)}
                      style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', padding: '8px 10px', borderRadius: 8 }}>
                Ver chave PIX
              </button>
            </div>

            <p style={{ opacity: 0.75, marginTop: 10, fontSize: 13 }}>
              Formas de pagamento: <b>PIX</b> (chave <b>{PIX_KEY}</b>), dinheiro ou cartão (combinar no WhatsApp).
            </p>
          </div>
        )}

        <footer style={{ marginTop: 18, paddingTop: 12, borderTop: '1px solid #222', opacity: 0.85 }}>
          WhatsApp: <a href={`https://wa.me/${WHATS_NUM}`} target="_blank" rel="noreferrer" style={{ color: '#8ab4ff' }}>+55 44 98860-6483</a><br/>
          Chave PIX: <b>{PIX_KEY}</b>
        </footer>
      </main>
    </div>
  );
}
