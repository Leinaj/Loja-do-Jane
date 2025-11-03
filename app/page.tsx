'use client';

import React, { useState } from 'react';

type Product = { id: number; name: string; price: number };

const PRODUCTS: Product[] = [
  { id: 1, name: 'Camiseta Preta', price: 59.9 },
  { id: 2, name: 'Camiseta Branca', price: 59.9 },
  { id: 3, name: 'Moletom',        price: 129.9 },
  { id: 4, name: 'Boné',           price: 39.9 },
];

const money = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});

  const add = (id: number) =>
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));

  const items = Object.entries(cart).map(([id, q]) => ({
    prod: PRODUCTS.find(p => p.id === Number(id))!,
    q: Number(q),
  }));

  const total = items.reduce((s, { prod, q }) => s + prod.price * q, 0);

  return (
    <main
      style={{
        maxWidth: 960,
        margin: '40px auto',
        padding: 16,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto',
      }}
    >
      <h1>Loja da Jane</h1>
      <p style={{ opacity: 0.8 }}>Agora com catálogo e carrinho ✅</p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
          marginTop: 24,
        }}
      >
        {PRODUCTS.map(p => (
          <div
            key={p.id}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 12,
              padding: 16,
              background: '#fff',
            }}
          >
            <div
              style={{
                height: 120,
                background: '#f3f3f3',
                borderRadius: 8,
                marginBottom: 12,
                display: 'grid',
                placeItems: 'center',
                color: '#999',
                fontSize: 12,
              }}
            >
              imagem
            </div>

            <strong>{p.name}</strong>
            <div style={{ margin: '8px 0' }}>{money(p.price)}</div>
            <button
              onClick={() => add(p.id)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #111',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              Adicionar
            </button>
          </div>
        ))}
      </section>

      <aside
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          background: '#111',
          color: '#fff',
          padding: 16,
          borderRadius: 12,
          width: 260,
        }}
      >
        <strong>Carrinho</strong>
        {items.length === 0 ? (
          <p style={{ marginTop: 8 }}>Vazio</p>
        ) : (
          <ul style={{ marginTop: 8, listStyle: 'none', padding: 0 }}>
            {items.map(({ prod, q }) => (
              <li key={prod.id} style={{ marginBottom: 6 }}>
                {prod.name} × {q} — {money(prod.price * q)}
              </li>
            ))}
            <hr style={{ margin: '8px 0', opacity: 0.3 }} />
            <div>
              <strong>Total: {money(total)}</strong>
            </div>
          </ul>
        )}
      </aside>
    </main>
  );
}
