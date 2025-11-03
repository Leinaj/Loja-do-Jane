'use client';

import { useState } from 'react';

type Product = { id: string; name: string; price: number; image: string };

const products: Product[] = [
  { id: 'camiseta-preta',  name: 'Camiseta Preta',  price: 69.9,  image: '/images/camiseta-preta.jpg' },
  { id: 'camiseta-branca', name: 'Camiseta Branca', price: 69.9,  image: '/images/camiseta-branca.jpg' },
  { id: 'moletom',         name: 'Moletom',         price: 159.9, image: '/images/moletom.jpg' },
  { id: 'bone',            name: 'Boné',            price: 59.9,  image: '/images/bone.jpg' },
];

function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function buildWhatsAppText(items: { product: Product; q: number }[], total: number, pixKey: string) {
  const lista = items
    .map(({ product, q }) => `• ${product.name} – ${q} × ${formatBRL(product.price)}`)
    .join('\n');
  return `Olá! Quero finalizar um pedido:\n${lista}\n\nTotal: ${formatBRL(total)}\nChave PIX: ${pixKey}`;
}

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const remove = (id: string) =>
    setCart((c) => {
      const q = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const items = Object.entries(cart).map(([id, q]) => ({ product: products.find((p) => p.id === id)!, q }));
  const total = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.q, 0);

  const pixKey = '44988606483';
  const waLink = (text: string) => `https://wa.me/5544988606483?text=${encodeURIComponent(text)}`;

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>
      <header style={{ padding: '24px 16px' }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Loja da Jane</h1>
        <p style={{ opacity: 0.8, margin: '4px 0 0' }}>Catálogo com carrinho ✅</p>
      </header>

      <main style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr', padding: '0 16px 40px' }}>
        {/* Catálogo */}
        <section>
          <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Catálogo</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {products.map((p) => (
              <div key={p.id} style={{ background: '#151515', borderRadius: 12, padding: 12, border: '1px solid #222' }}>
                <div
                  style={{
                    height: 120,
                    background: '#0f0f0f',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ display: 'block' }}>{p.name}</strong>
                    <span style={{ opacity: 0.8, fontSize: 14 }}>{formatBRL(p.price)}</span>
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
        </section>

        {/* Carrinho */}
        <section>
          <h2 style={{ fontSize: 18, margin: '16px 0 8px' }}>Carrinho</h2>
          {items.length === 0 ? (
            <p style={{ opacity: 0.75 }}>Seu carrinho está vazio.</p>
          ) : (
            <div style={{ background: '#151515', borderRadius: 12, padding: 12, border: '1px solid #222' }}>
              {items.map(({ product, q }) => (
                <div
                  key={product.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #333' }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{product.name}</div>
                    <div style={{ opacity: 0.8, fontSize: 14 }}>
                      {q} × {formatBRL(product.price)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => remove(product.id)} style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', padding: '6px 10px', borderRadius: 8 }}>
                      -
                    </button>
                    <button onClick={() => add(product.id)} style={{ background: '#2d6cdf', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 8 }}>
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 700 }}>
                <span>Total</span>
                <span>{formatBRL(total)}</span>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <a
                  href={waLink(buildWhatsAppText(items, total, pixKey))}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: '#2d6cdf', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: 8, textDecoration: 'none' }}
                >
                  Pedir no WhatsApp
                </a>
                <button
                  onClick={() => alert(`Chave PIX: ${pixKey}`)}
                  style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #3a3a3a', padding: '8px 10px', borderRadius: 8 }}
                >
                  Ver chave PIX
                </button>
              </div>

              <p style={{ opacity: 0.7, marginTop: 12, fontSize: 13 }}>
                Formas de pagamento: <b>PIX</b> (chave <b>{pixKey}</b>), dinheiro, ou cartão (combinar no WhatsApp).
              </p>
            </div>
          )}
        </section>
      </main>

      <footer style={{ padding: '16px', borderTop: '1px solid #222', opacity: 0.85 }}>
        <div>
          WhatsApp:{' '}
          <a href={waLink('Olá! Gostaria de tirar uma dúvida.')} target="_blank" rel="noreferrer" style={{ color: '#8ab4ff' }}>
            +55 44 98860-6483
          </a>
        </div>
        <div>Chave PIX: <b>{pixKey}</b></div>
      </footer>
    </div>
  );
}
