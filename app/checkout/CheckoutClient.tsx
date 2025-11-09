'use client';

import React, { useMemo, useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import Link from 'next/link';

type Address = {
  name: string;
  phone: string;
  cep?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  complement?: string;
};

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CheckoutClient() {
  const { items, removeItem, updateQty, clear, subtotal } = useCart();
  const [addr, setAddr] = useState<Address>({ name: '', phone: '' });
  const [coupon, setCoupon] = useState('');

  const discountPct = useMemo(() => (coupon.trim().toUpperCase() === 'JANE10' ? 0.1 : 0), [coupon]);
  const discount = useMemo(() => subtotal * discountPct, [subtotal, discountPct]);
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);

  const finish = () => {
    // Envia pro WhatsApp com o resumo do pedido
    const lines = [
      '*Novo pedido*',
      '',
      '*Itens:*',
      ...items.map((it) => `• ${it.quantity} × ${it.name} — ${formatBRL(it.price * it.quantity)}`),
      '',
      `Subtotal: ${formatBRL(subtotal)}`,
      `Desconto: -${formatBRL(discount)}`,
      `*Total:* ${formatBRL(total)}`,
      '',
      '*Endereço:*',
      `${addr.name} — ${addr.phone}`,
      `${addr.street ?? ''}, ${addr.number ?? ''}`,
      `${addr.city ?? ''} - ${addr.state ?? ''}`,
      `${addr.cep ?? ''}`,
      addr.complement ? `Comp.: ${addr.complement}` : '',
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    // seu número com DDI/DDD
    const phone = '5544988606483';
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-semibold">Checkout</h1>

      {/* CARRINHO */}
      <section className="rounded-2xl border border-white/10 p-5">
        <h2 className="mb-4 text-xl font-semibold">Carrinho</h2>

        {items.length === 0 ? (
          <p className="text-white/70">
            Seu carrinho está vazio.{' '}
            <Link href="/" className="text-emerald-400 underline">
              Voltar para a loja
            </Link>
          </p>
        ) : (
          <ul className="space-y-4">
            {items.map((it) => (
              <li key={String(it.id)} className="flex items-center gap-4">
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt={it.name} className="h-16 w-16 rounded-xl object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-neutral-800" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-white/70">{formatBRL(it.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(it.id, it.quantity - 1)}
                    className="h-8 w-8 rounded-xl bg-neutral-800 text-lg hover:bg-neutral-700"
                  >
                    –
                  </button>
                  <div className="w-10 text-center">{it.quantity}</div>
                  <button
                    onClick={() => updateQty(it.id, it.quantity + 1)}
                    className="h-8 w-8 rounded-xl bg-neutral-800 text-lg hover:bg-neutral-700"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="rounded-xl bg-rose-600/20 px-3 py-2 text-rose-300 hover:bg-rose-600/30"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 ? (
          <div className="mt-4">
            <button onClick={clear} className="rounded-xl bg-neutral-800 px-4 py-2 hover:bg-neutral-700">
              Limpar carrinho
            </button>
          </div>
        ) : null}
      </section>

      {/* ENDEREÇO */}
      <section className="rounded-2xl border border-white/10 p-5">
        <h2 className="mb-4 text-xl font-semibold">Endereço</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            className="rounded-xl bg-neutral-900 px-4 py-3 outline-none"
            placeholder="Nome *"
            value={addr.name}
            onChange={(e) => setAddr({ ...addr, name: e.target.value })}
          />
          <input
            className="rounded-xl bg-neutral-900 px-4 py-3 outline-none"
            placeholder="Telefone *"
            value={addr.phone}
            onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
          />
          <input
            className="rounded-xl bg-neutral-900 px-4 py-3 outline-none"
            placeholder="CEP"
            value={addr.cep ?? ''}
            onChange={(e) => setAddr({ ...addr, cep: e.target.value })}
          />
          <input
            className="rounded-xl bg-neutral-900 px-4 py-3 outline-none"
            placeholder="Rua *"
            value={addr.street ?? ''}
            onChange={(e) => setAddr({ ...addr, street: e.target.value })}
          />
          <input
            className="rounded-xl bg-neutral-900 px-4 py-3 outline-none"
            placeholder="Número *"
            value={addr.number ?? ''}
            onChange={(e) => setAddr({ ...addr, number: e.target.value })}
          />
          <input
            className="rounded-xl bg-neutral-900 px-4 py-3 outline-none"
            placeholder="Cidade *"
            value={addr.city ?? ''}
            onChange={(e) => setAddr({ ...addr, city: e.target.value })}
          />
          <input
            className="rounded-xl bg-neutral-900 px-4 py-3 outline-none"
            placeholder="Estado *"
            value={addr.state ?? ''}
            onChange={(e) => setAddr({ ...addr, state: e.target.value })}
          />
          <input
            className="rounded-xl bg-neutral-900 px-4 py-3 outline-none sm:col-span-2"
            placeholder="Complemento"
            value={addr.complement ?? ''}
            onChange={(e) => setAddr({ ...addr, complement: e.target.value })}
          />
        </div>
      </section>

      {/* CUPOM + RESUMO (sem frete) */}
      <section className="rounded-2xl border border-white/10 p-5">
        <h2 className="mb-4 text-xl font-semibold">Resumo</h2>

        <div className="mb-5 flex gap-3">
          <input
            className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 outline-none"
            placeholder="Cupom de desconto"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            onClick={() => void 0}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-500"
          >
            Aplicar
          </button>
        </div>

        <div className="space-y-2 text-white/90">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Desconto ({Math.round(discountPct * 100)}%)</span>
            <span>-{formatBRL(discount)}</span>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3 text-lg font-semibold">
            <div className="flex items-center justify-between">
              <span>Total:</span>
              <span>{formatBRL(total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={items.length === 0}
            onClick={finish}
            className="rounded-2xl bg-emerald-600 px-6 py-4 font-medium hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Finalizar pedido
          </button>
          <Link
            href="/"
            className="rounded-2xl border border-emerald-700/40 px-6 py-4 hover:bg-emerald-600/10"
          >
            Voltar para a loja
          </Link>
        </div>
      </section>
    </div>
  );
}