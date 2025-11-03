'use client';

import Image from 'next/image';
import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string; // caminho dentro de /public
};

const WHATSAPP_NUMBER = '5544988606483'; // +55 44 98860-6483 sem espaços
const PIX_KEY = '44988606483';

// ATENÇÃO: ajuste os nomes dos arquivos conforme estiverem em /public/images
const PRODUCTS: Product[] = [
  { id: 'camiseta-preta',  name: 'Camiseta Preta',  price: 69.9,  image: '/images/camiseta-preta.jpg' },
  { id: 'camiseta-branca', name: 'Camiseta Branca', price: 69.9,  image: '/images/camiseta-branca.jpg' },
  { id: 'moletom',         name: 'Moletom',         price: 159.9, image: '/images/moletom.jpg' },
  { id: 'bone',            name: 'Boné',            price: 59.9,  image: '/images/bone.jpg' },
];

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});

  function add(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }

  function remove(id: string) {
    setCart((c) => {
      const next = { ...c };
      const q = (next[id] || 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  }

  const items = Object.entries(cart).map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id)!;
    return { ...p, qty, subtotal: p.price * qty };
  });

  const total = items.reduce((s, i) => s + i.subtotal, 0);

  const waText = encodeURIComponent(
    `Olá! Quero fazer um pedido:\n` +
      items.map((i) => `• ${i.qty}x ${i.name} — R$ ${i.subtotal.toFixed(2)}`).join('\n') +
      `\n\nTotal: R$ ${total.toFixed(2)}\n` +
      `Formas de pagamento: Pix (chave ${PIX_KEY}) ou combinar na entrega.`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  return (
    <div style={{ minHeight: '100vh', background: '#0b0b0b', color: '#e5e7eb' }}>
      <header style={{ padding: 24, borderBottom: '1px solid #1f2937' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Loja da Jane</h1>
        <p style={{ opacity: 0.7 }}>Catálogo com carrinho 🛒</p>
      </header>

      <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Catálogo</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                style={{
                  background: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                {/* Se não quiser usar <Image/>, pode trocar por <img ... /> */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 120,
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#0f172a',
                  }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 220px"
                    priority
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>R$ {p.price.toFixed(2)}</div>
                </div>

                <button
                  onClick={() => add(p.id)}
                  style={{
                    marginTop: 10,
                    width: '100%',
                    background: '#2563eb',
                    color: '#fff',
                    border: 0,
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Carrinho</h2>

          {items.length === 0 ? (
            <p style={{ opacity: 0.7 }}>Seu carrinho está vazio.</p>
          ) : (
            <div
              style={{
                background: '#111827',
                border: '1px solid #1f2937',
                borderRadius: 12,
                padding: 16,
              }}
            >
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map((i) => (
                  <li
                    key={i.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '8px 0',
                      borderBottom: '1px dashed #1f2937',
                    }}
                  >
                    <span>
                      {i.qty}x {i.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => remove(i.id)}
                        style={{
                          background: '#374151',
                          color: '#fff',
                          border: 0,
                          padding: '4px 10px',
                          borderRadius: 6,
                        }}
                      >
                        −
                      </button>
                      <button
                        onClick={() => add(i.id)}
                        style={{
                          background: '#2563eb',
                          color: '#fff',
                          border: 0,
                          padding: '4px 10px',
                          borderRadius: 6,
                        }}
                      >
                        +
                      </button>
                      <span>R$ {i.subtotal.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                <strong>Total</strong>
                <strong>R$ {total.toFixed(2)}</strong>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: 14,
                  background: '#22c55e',
                  color: '#0b0b0b',
                  textDecoration: 'none',
                  fontWeight: 700,
                  padding: '10px 14px',
                  borderRadius: 8,
                }}
              >
                Finalizar pedido no WhatsApp
              </a>
            </div>
          )}
        </section>

        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Formas de pagamento</h2>
          <ul style={{ opacity: 0.85, lineHeight: 1.8 }}>
            <li>Pix — <strong>Chave:</strong> {PIX_KEY}</li>
            <li>Cartão (crédito/débito) — combinar no WhatsApp</li>
            <li>Dinheiro — combinar no WhatsApp</li>
          </ul>

          <div style={{ marginTop: 10, opacity: 0.8 }}>
            WhatsApp:{' '}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              style={{ color: '#60a5fa', textDecoration: 'underline' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              +55 44 98860-6483
            </a>
            <br />
            Chave Pix: <strong>{PIX_KEY}</strong>
          </div>
        </section>
      </main>
    </div>
  );
}
