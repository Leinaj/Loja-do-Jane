'use client';

import { useState } from 'react';
// caminho relativo até /components/cart/context
import { useCart } from '../../../components/cart/context';
import type { Product } from '../../data/products';

export default function ProductClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState<number>(1);

  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const handleAdd = () => {
    // Estrutura comum: { id, name, price, image, qty }
    // Se seu contexto usa outro nome de campo (quantity), troque aqui.
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty,
    });
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      {/* Troque por <Image/> se suas imagens estiverem prontas */}
      <div
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          background: '#121212',
          borderRadius: 16,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 16 }}
          />
        ) : (
          'Imagem do produto'
        )}
      </div>

      <h1 style={{ fontSize: 32, margin: '8px 0' }}>{product.name}</h1>
      <p style={{ color: '#9BA3AF', marginBottom: 16 }}>{product.description}</p>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        R$ {product.price.toFixed(2).replace('.', ',')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          onClick={dec}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: '1px solid #2A2A2A',
            background: '#151515',
            color: '#fff',
          }}
        >
          –
        </button>
        <div style={{ minWidth: 48, textAlign: 'center', fontSize: 18 }}>{qty}</div>
        <button
          onClick={inc}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: '1px solid #2A2A2A',
            background: '#151515',
            color: '#fff',
          }}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        style={{
          width: '100%',
          height: 52,
          borderRadius: 14,
          background: '#16a34a',
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}