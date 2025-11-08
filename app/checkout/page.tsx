'use client';

import { useMemo, useState } from 'react';
import { useCart } from '../../lib/cart';
import { money } from '../../lib/format';

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
  const { items, remove, clear } = useCart();

  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
  });

  const total = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc: number, it: any) => {
      const qty = Number(it?.quantity ?? 1);
      const price = Number(it?.price ?? 0);
      return acc + price * qty;
    }, 0);
  }, [items]);

  function validate(): string[] {
    const missing: string[] = [];
    if (!address.name.trim()) missing.push('nome');
    if (!address.phone.trim()) missing.push('telefone');
    if (!address.cep.trim()) missing.push('cep');
    if (!address.street.trim()) missing.push('rua');
    if (!address.number.trim()) missing.push('número');
    if (!address.city.trim()) missing.push('cidade');
    if (!address.state.trim()) missing.push('estado');
    return missing;
  }

  function updateField<K extends keyof Address>(key: K, value: string) {
    setAddress(prev => ({ ...prev, [key]: value }));
  }

  function handleFinish() {
    const missing = validate();
    if (missing.length) {
      alert(`Preencha: ${missing.join(', ')}`);
      return;
    }

    alert(
      `✅ Pedido confirmado!\n` +
        `Cliente: ${address.name}\n` +
        `Total: ${money(total)}\n` +
        `Endereço: ${address.street}, ${address.number} - ${address.city}/${address.state}`
    );
    clear();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Carrinho</h2>
        <div className="space-y-3">
          {items.length > 0 ? (
            items.map((it: any) => (
              <div
                key={it.id}
                className="flex items-center justify-between rounded-lg border border-white/10 p-3"
              >
                <div>
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-white/70">
                    {it.quantity ?? 1} × {money(it.price ?? 0)}
                  </p>
                </div>
                <button
                  onClick={() => remove(it.id)}
                  className="text-sm px-3 py-1 rounded-md bg-red-600/80 hover:bg-red-600 transition"
                >
                  Remover
                </button>
              </div>
            ))
          ) : (
            <p className="text-white/70">Carrinho vazio.</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-lg font-medium">Total</span>
          <span className="text-lg font-semibold">{money(total)}</span>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Endereço</h2>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(address).map(([key, val]) => (
            <input
              key={key}
              className="rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-emerald-500"
              placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} *`}
              value={val}
              onChange={e =>
                updateField(key as keyof Address, e.target.value)
              }
            />
          ))}
        </div>
      </section>

      <button
        onClick={handleFinish}
        disabled={!items.length}
        className="w-full h-12 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition font-medium"
      >
        Finalizar Pedido
      </button>
    </main>
  );
}