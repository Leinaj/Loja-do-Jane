'use client';

import { useMemo, useState } from 'react';

/** ====== CONFIGURAÇÕES DA LOJA ====== */
const WHATSAPP_E164 = '5544988606483'; // +55 44 98860-6483
const PIX_KEY = '44988606483';

/** ====== PRODUTOS ======
 * Troque os nomes dos arquivos de imagem pelos que você subiu em /public/images
 * Dica: clique no arquivo no GitHub e copie o nome EXATO (com .jpg ou .jpeg)
 */
type Product = {
  id: string;
  name: string;
  price: number;
  image: string; // caminho relativo à pasta /public
};

const PRODUCTS: Product[] = [
  {
    id: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 69.9,
    image: '/images/IMG-20251004-WA0000.jpg',
  },
  {
    id: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 69.9,
    image: '/images/IMG-20251004-WA0003.jpg',
  },
  {
    id: 'moletom',
    name: 'Moletom',
    price: 159.9,
    image: '/images/file_00000000dbd061f6a.jpg', // ajuste se o nome for diferente
  },
  {
    id: 'bone',
    name: 'Boné',
    price: 59.9,
    image: '/images/file_00000000ee8071f58.jpg', // ajuste se o nome for diferente
  },
];

/** ====== COMPONENTE ====== */
export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});

  function addToCart(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }

  function removeFromCart(id: string) {
    setCart((c) => {
      const qty = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (qty <= 0) {
        delete next[id];
      } else {
        next[id] = qty;
      }
      return next;
    });
  }

  const items = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id)!;
      return { ...p, qty };
    });
  }, [cart]);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  function openWhatsAppCheckout() {
    if (items.length === 0) return;

    const lines = [
      'Olá! Quero fazer um pedido 🛍️',
      '',
      ...items.map(
        (it) => `• ${it.name} x${it.qty} — R$ ${formatBRL(it.price * it.qty)}`
      ),
      '',
      `Total: *R$ ${formatBRL(total)}*`,
      '',
      `Formas de pagamento:`,
      `• Pix (chave: ${PIX_KEY})`,
      `• Cartão/Dinheiro, combinamos pelo WhatsApp`,
    ];

    const waText = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${WHATSAPP_E164}?text=${waText}`;
    window.open(url, '_blank');
  }

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      alert('Chave Pix copiada!');
    } catch {
      alert('Não foi possível copiar. Tente selecionar e copiar manualmente.');
    }
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#0b0b0d',
        color: '#e6e6e6',
        padding: 16,
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* HEADER */}
      <header style={{ padding: 12, marginBottom: 8 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Loja da Jane</h1>
        <p style={{ opacity: 0.8, marginTop: 4 }}>Catálogo com carrinho 💚</p>
      </header>

      {/* CATÁLOGO */}
      <section style={{ padding: 12 }}>
        <h2 style={{ fontSize: 18, margin: '0 0 12px' }}>Catálogo</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              style={{
                background: '#141418',
                border: '1px solid #23232a',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background: '#0f0f13',
                  borderRadius: 8,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                {/* usar <img> comum pra não depender de config do next/image */}
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gap: 6 }}>
                <strong style={{ fontSize: 14 }}>{p.name}</strong>
                <span style={{ opacity: 0.9, fontSize: 13 }}>
                  R$ {formatBRL(p.price)}
                </span>

                <button
                  onClick={() => addToCart(p.id)}
                  style={btnStyle}
                  aria-label={`Adicionar ${p.name}`}
                >
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARRINHO */}
      <section style={{ padding: 12 }}>
        <h2 style={{ fontSize: 18, margin: '0 0 12px' }}>Carrinho</h2>

        {items.length === 0 ? (
          <p style={{ opacity: 0.75 }}>Seu carrinho está vazio.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: 10,
              maxWidth: 720,
            }}
          >
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: 8,
                  alignItems: 'center',
                  background: '#141418',
                  border: '1px solid #23232a',
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{it.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {it.qty} × R$ {formatBRL(it.price)}
                  </div>
                </div>

                <div style={{ fontSize: 13, opacity: 0.9 }}>
                  R$ {formatBRL(it.price * it.qty)}
                </div>

                <button onClick={() => removeFromCart(it.id)} style={btnGhost}>
                  Remover
                </button>
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 4,
                paddingTop: 8,
                borderTop: '1px dashed #2b2b33',
              }}
            >
              <strong>Total</strong>
              <strong>R$ {formatBRL(total)}</strong>
            </div>

            <button onClick={openWhatsAppCheckout} style={btnCTA}>
              Finalizar pedido no WhatsApp
            </button>
          </div>
        )}
      </section>

      {/* CONTATO / PAGAMENTO */}
      <section style={{ padding: 12, marginTop: 8 }}>
        <h2 style={{ fontSize: 18, margin: '0 0 12px' }}>Pagamento & Contato</h2>

        <div style={{ display: 'grid', gap: 10, maxWidth: 720 }}>
          <div
            style={{
              background: '#141418',
              border: '1px solid #23232a',
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div style={{ marginBottom: 6 }}>
              <strong>WhatsApp: </strong>
              <a
                href={`https://wa.me/${WHATSAPP_E164}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#a0e9a5', textDecoration: 'underline' }}
              >
                +55 44 98860-6483
              </a>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div>
                <strong>Chave Pix:</strong> {PIX_KEY}
              </div>
              <button onClick={copyPix} style={btnStyle}>
                Copiar chave
              </button>
            </div>

            <p style={{ opacity: 0.75, marginTop: 8, fontSize: 13 }}>
              Aceitamos <b>Pix</b>, <b>Cartão</b> e <b>Dinheiro</b>.
              Entrega/retirada combinada no WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/** ====== ESTILOS DE BOTÕES ====== */
const btnStyle: React.CSSProperties = {
  background: '#1e1e25',
  border: '1px solid #2b2b33',
  color: '#e6e6e6',
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 13,
  cursor: 'pointer',
};

const btnGhost: React.CSSProperties = {
  ...btnStyle,
  background: 'transparent',
};

const btnCTA: React.CSSProperties = {
  ...btnStyle,
  background: '#1d3b26',
  borderColor: '#2a5a38',
};

/** ====== UTILS ====== */
function formatBRL(v: number) {
  return v.toFixed(2).replace('.', ',');
}
