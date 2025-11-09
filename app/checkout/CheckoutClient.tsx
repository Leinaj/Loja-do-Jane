'use client';

import React, { useMemo, useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import { toast } from '@/components/ui/toast';

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
  coupon?: string;
};

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function CheckoutClient() {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();
  const [addr, setAddr] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
    coupon: '',
  });

  const shipping = useMemo(() => (items.length ? 24.4 : 0), [items]);
  const total = subtotal + shipping;

  const change = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr(a => ({ ...a, [k]: e.target.value }));

  const finish = () => {
    if (!items.length) {
      toast('Seu carrinho está vazio');
      return;
    }
    toast('Pedido finalizado! 🎉');
    clear();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-semibold">Checkout</h1>

      {/* CARRINHO */}
      <section className="rounded-xl border border-white/10 p-4 space-y-4">
        <h2 className="text-xl font-medium">Carrinho</h2>
        {!items.length && <p className="text-white/70">Seu carrinho está vazio.</p>}
        {items.map(it => (
          <div key={it.id} className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="min-w-0">
              <p className="font-medium truncate">{it.name}</p>
              <p className="text-sm text-white/70">{formatBRL(it.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))} className="px-2 py-1 rounded bg-emerald-900/40">−</button>
              <span>{it.qty}</span>
              <button onClick={() => updateQty(it.id, it.qty + 1)} className="px-2 py-1 rounded bg-emerald-900/40">+</button>
            </div>
            <div className="w-24 text-right">{formatBRL(it.price * it.qty)}</div>
            <button onClick={() => removeItem(it.id)} className="px-2 py-1 rounded bg-red-900/40">Remover</button>
          </div>
        ))}
      </section>

      {/* ENDEREÇO */}
      <section className="rounded-xl border border-white/10 p-4 space-y-4">
        <h2 className="text-xl font-medium">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Nome *" value={addr.name} onChange={change('name')} />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Telefone *" value={addr.phone} onChange={change('phone')} />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="CEP *" value={addr.cep} onChange={change('cep')} />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Rua *" value={addr.street} onChange={change('street')} />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Número *" value={addr.number} onChange={change('number')} />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Cidade *" value={addr.city} onChange={change('city')} />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Estado *" value={addr.state} onChange={change('state')} />
          <input className="rounded bg-white/5 px-3 py-2" placeholder="Cupom (opcional)" value={addr.coupon} onChange={change('coupon')} />
        </div>
      </section>

      {/* RESUMO */}
      <section className="rounded-xl border border-white/10 p-4 space-y-3">
        <h2 className="text-xl font-medium">Resumo</h2>
        <div className="flex justify-between"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
        <div className="flex justify-between"><span>Frete • PAC (5–8 dias)</span><span>{formatBRL(shipping)}</span></div>
        <div className="border-t border-white/10 my-2" />
        <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatBRL(total)}</span></div>

        <div className="pt-3 flex gap-3">
          <button onClick={finish} className="px-4 py-2 rounded bg-emerald-600 text-white">Finalizar pedido</button>
        </div>
      </section>
    </div>
  );
}