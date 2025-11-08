'use client';

import { useCart } from '@/lib/cart';

export default function Checkout() {
  const { items, remove, clear, total } = useCart();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Checkout</h1>

      <section className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
        <h2 className="text-lg font-medium">Carrinho</h2>

        {items.length === 0 ? (
          <p className="text-white/70">Carrinho vazio.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 p-3"
                >
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-white/70">
                      {it.quantity} × R$ {it.price.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(it.id)}
                    className="rounded-md bg-red-600/80 px-3 py-2 text-sm text-white hover:bg-red-600"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-white/70">Total</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={clear}
                className="rounded-lg bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600"
              >
                Limpar carrinho
              </button>
              <button className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
                Finalizar pedido
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}