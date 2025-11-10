'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// ⚠️ NÃO exporte `metadata` neste arquivo (se exportar, ele vira Server Component e quebra).

import { useCart } from '@/components/cart/context';
// Se o alias @ não existir no seu tsconfig.json, troque por:
// import { useCart } from '../../components/cart/context';

export default function CheckoutPage() {
  const { items, total } = useCart();

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>Finalizar compra</h1>

      {items.length === 0 ? (
        <p>Seu carrinho está vazio 😢</p>
      ) : (
        <>
          <ul style={{ paddingLeft: 16 }}>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: 8 }}>
                {item.name} — {item.qty}x R$ {item.price.toFixed(2).replace('.', ',')}
              </li>
            ))}
          </ul>
          <h3>Total: R$ {total.toFixed(2).replace('.', ',')}</h3>
        </>
      )}
    </main>
  );
}