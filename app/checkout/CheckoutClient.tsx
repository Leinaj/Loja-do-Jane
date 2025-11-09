'use client';

import React, { useMemo, useState } from 'react';
import { useCart } from '../../components/providers/CartProvider';

type Address = {
  name: string;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
};

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CheckoutClient() {
  const { items, clear } = useCart();

  const subtotal = useMemo(
    () => items.reduce((a, i) => a + i.price * i.qty, 0),
    [items]
  );

  const [coupon, setCoupon] = useState('');
  const discount = 0;
  const freight = 24.4; // exemplo
  const total = subtotal - discount + freight;

  const [addr, setAddr] = useState<Address>({ name: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pedido finalizado!');
    clear();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="rounded-2xl border border-emerald-900/40 p-4">
            <h2 className="text-lg font-semibold mb-3">Carrinho</h2>
            <ul className="space-y-2">
              {items.map(it => (
                <li key={String(it.id)} className="flex justify-between text-sm">
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <span>{formatBRL(it.price * it.qty)}</span>
                </li>
              ))}
              {items.length === 0 && (
                <li className="text-sm opacity-70">Seu carrinho está vazio.</li>
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-emerald-900/40 p-4">
            <h2 className="text-lg font-semibold mb-3">Endereço</h2>
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                className="w-full rounded-lg bg-black/30 p-2"
                placeholder="Nome completo"
                value={addr.name}
                onChange={e => setAddr({ ...addr, name: e.target.value })}
                required
              />
              <input
                className="w-full rounded-lg bg-black/30 p-2"
                placeholder="Telefone"
                value={addr.phone || ''}
                onChange={e => setAddr({ ...addr, phone: e.target.value })}
              />
              <input
                className="w-full rounded-lg bg-black/30 p-2"
                placeholder="CEP"
                value={addr.cep || ''}
                onChange={e => setAddr({ ...addr, cep: e.target.value })}
              />
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-lg bg-black/30 p-2"
                  placeholder="Rua"
                  value={addr.street || ''}
                  onChange={e => setAddr({ ...addr, street: e.target.value })}
                />
                <input
                  className="w-32 rounded-lg bg-black/30 p-2"
                  placeholder="Número"
                  value={addr.number || ''}
                  onChange={e => setAddr({ ...addr, number: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-lg bg-black/30 p-2"
                  placeholder="Cidade"
                  value={addr.city || ''}
                  onChange={e => setAddr({ ...addr, city: e.target.value })}
                />
                <input
                  className="w-24 rounded-lg bg-black/30 p-2"
                  placeholder="UF"
                  value={addr.state || ''}
                  onChange={e => setAddr({ ...addr, state: e.target.value })}
                />
              </div>

              <div className="flex gap-3 items-center pt-2">
                <input
                  className="flex-1 rounded-lg bg-black/30 p-2"
                  placeholder="Cupom de desconto"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                />
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 bg-emerald-600 text-white"
                >
                  Aplicar
                </button>
              </div>

              <button className="w-full mt-2 rounded-xl bg-emerald-600 text-white py-3 font-semibold">
                Finalizar pedido
              </button>
            </form>
          </section>
        </div>

        <aside className="rounded-2xl border border-emerald-900/40 p-4 h-fit">
          <h2 className="text-lg font-semibold mb-3">Resumo</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Desconto</span>
              <span>{formatBRL(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span>{formatBRL(freight)}</span>
            </div>
            <hr className="my-2 border-emerald-900/40" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatBRL(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}