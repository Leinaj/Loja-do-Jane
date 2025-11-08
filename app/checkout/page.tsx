// app/checkout/page.tsx
'use client';

import { useMemo, useRef, useState } from 'react';
import { useCart } from '../../lib/cart'; // mantém seu hook de carrinho
import { money } from '../../lib/format'; // <-- agora vem daqui

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

  // total calculado a partir do carrinho
  const total = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc: number, it: any) => {
      const qty = Number(it?.quantity ?? 1);
      const price = Number(it?.price ?? 0);
      return acc + price * qty;
    }, 0);
  }, [items]);

  // validação simples dos campos obrigatórios
  function validate(): string[] {
    const missing: string[] = [];
    if (!address.name.trim()) missing.push('name');
    if (!address.phone.trim()) missing.push('phone');
    if (!address.cep.trim()) missing.push('cep');
    if (!address.street.trim()) missing.push('street');
    if (!address.number.trim()) missing.push('number');
    if (!address.city.trim()) missing.push('city');
    if (!address.state.trim()) missing.push('state');
    return missing;
  }

  function updateField<K extends keyof Address>(key: K, value: string) {
    setAddress(prev => ({ ...prev, [key]: value }));
  }

  function handleFinish() {
    const missing = validate();
    if (missing.length) {
      alert(
        `Preencha os campos obrigatórios: ${missing.join(', ')}`
      );
      return;
    }

    // mensagem de confirmação
    alert(
      `Pedido recebido!\n` +
        `Cliente: ${address.name.toUpperCase()}\n` +
        `Total: ${money(total)}\n` +
        `Entrega: ${address.street}, ${address.number} - ${address.city}/${address.state}`
    );

    // limpa carrinho depois de confirmar
    clear();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {/* Resumo do carrinho */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Seu carrinho</h2>
        <div className="space-y-3">
          {Array.isArray(items) && items.length > 0 ? (
            items.map((it: any) => (
              <div
                key={String(it?.id)}
                className="flex items-center justify-between rounded-lg border border-white/10 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{it?.name ?? 'Produto'}</p>
                  <p className="text-sm text-white/70">
                    {Number(it?.quantity ?? 1)} × {money(Number(it?.price ?? 0))}
                  </p>
                </div>
                <button
                  onClick={() => remove(it?.id)}
                  className="text-sm px-3 py-1 rounded-md bg-red-600/80 hover:bg-red-600 transition"
                >
                  Remover
                </button>
              </div>
            ))
          ) : (
            <p className="text-white/70">Seu carrinho está vazio.</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-lg font-medium">Total</span>
          <span className="text-lg font-semibold">{money(total)}</span>
        </div>
      </section>

      {/* Dados de entrega */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Endereço de entrega</h2>

        <div className="grid grid-cols-1 gap-3">
          <input
            className="rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-emerald-500"
            placeholder="Nome completo *"
            value={address.name}
            onChange={e => updateField('name', e.target.value)}
          />
          <input
            className="rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-emerald-500"
            placeholder="Telefone *"
            value={address.phone}
            onChange={e => updateField('phone', e.target.value)}
            inputMode="tel"
          />
          <input
            className="rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-emerald-500"
            placeholder="CEP *"
            value={address.cep}
            onChange={e => updateField('cep', e.target.value)}
            inputMode="numeric"
          />
          <input
            className="rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-emerald-500"
            placeholder="Rua *"
            value={address.street}
            onChange={e => updateField('street', e.target.value)}
          />
          <input
            className="rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-emerald-500"
            placeholder="Número *"
            value={address.number}
            onChange={e => updateField('number', e.target.value)}
            inputMode="numeric"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-emerald-500"
              placeholder="Cidade *"
              value={address.city}
              onChange={e => updateField('city', e.target.value)}
            />
            <input
              className="rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-emerald-500"
              placeholder="UF *"
              value={address.state}
              onChange={e => updateField('state', e.target.value)}
              maxLength={2}
            />
          </div>
        </div>
      </section>

      <div className="pt-2">
        <button
          onClick={handleFinish}
          disabled={!items?.length}
          className="w-full h-12 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 transition font-medium"
        >
          Finalizar pedido
        </button>
      </div>
    </main>
  );
}