// app/checkout/page.tsx
'use client';

import { useCart } from '@/lib/cart';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

export default function CheckoutPage() {
  const { items, remove, clear, total } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
  });

  const cartTotal = useMemo(() => total, [total]);

  const handleFinish = () => {
    if (
      !address.name ||
      !address.phone ||
      !address.cep ||
      !address.street ||
      !address.number ||
      !address.city ||
      !address.state
    ) {
      alert('Preencha todos os campos do endereço.');
      return;
    }

    const order = {
      items,
      address,
      total: cartTotal,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('last_order_v1', JSON.stringify(order));
    router.push('/pagamento');
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-4xl font-bold">Checkout</h1>

      <section className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
        <h2 className="text-xl font-semibold mb-3">Carrinho</h2>

        {items.length === 0 ? (
          <p className="text-white/70">Carrinho vazio.</p>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between rounded-xl bg-neutral-900 p-3 border border-white/10"
              >
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-white/60">
                    {it.quantity} × R$ {it.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <button
                  onClick={() => remove(it.id)}
                  className="px-3 py-2 rounded-md bg-rose-600 hover:bg-rose-500 transition"
                >
                  Remover
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-lg">Total</span>
              <span className="text-xl font-bold">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clear}
                className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition"
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 space-y-3">
        <h2 className="text-xl font-semibold mb-1">Endereço</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              ['name', 'Name *'],
              ['phone', 'Phone *'],
              ['cep', 'Cep *'],
              ['street', 'Street *'],
              ['number', 'Number *'],
              ['city', 'City *'],
              ['state', 'State *'],
            ] as const
          ).map(([key, label]) => (
            <input
              key={key}
              placeholder={label}
              value={address[key]}
              onChange={(e) =>
                setAddress((a) => ({ ...a, [key]: e.target.value }))
              }
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleFinish}
          className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition font-medium"
          disabled={items.length === 0}
        >
          Finalizar pedido
        </button>
      </div>
    </main>
  );
}