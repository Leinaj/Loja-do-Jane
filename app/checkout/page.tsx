'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useCart } from '@/components/cart/context';

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    discount,
    shipping,
    total,
    removeItem,
    clear,
    updateQty,
    applyCoupon,
    setShipping,
  } = useCart();

  // ⬇️ Daqui pra baixo mantenha o SEU JSX (inputs, botões, toasts, etc.)
  // Exemplo minimalista apenas para referência — substitua pelo seu JSX bonito:
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Carrinho</h1>

      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-sm opacity-75">
                {i.qty} × R$ {i.price.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(i.id, Math.max(1, i.qty - 1))}>-</button>
              <span>{i.qty}</span>
              <button onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
              <button onClick={() => removeItem(i.id)}>Remover</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-1">
        <div>Subtotal: R$ {subtotal.toFixed(2)}</div>
        <div>Desconto: - R$ {discount.toFixed(2)}</div>
        <div>Frete: R$ {shipping.toFixed(2)}</div>
        <div className="font-bold">Total: R$ {total.toFixed(2)}</div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => applyCoupon('JANE10')}>Aplicar cupom JANE10</button>
        <button onClick={() => setShipping(24.4)}>Calcular frete PAC</button>
        <button onClick={clear}>Limpar carrinho</button>
      </div>
    </main>
  );
}