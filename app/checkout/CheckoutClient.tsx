'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/components/providers/CartProvider';
import Link from 'next/link';

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
  complement?: string;
};

const formatBRL = (v: number) =>
  (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const WHATS_NUMBER = '5544988606483'; // +55 44 98860-6483

export default function CheckoutClient() {
  const { items, removeItem, clear, getTotal } = useCart();

  const [addr, setAddr] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
    complement: '',
  });

  const [lookingUpCep, setLookingUpCep] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponPct, setCouponPct] = useState(0);
  const [shipping, setShipping] = useState(0);

  const subtotal = useMemo(() => getTotal(), [getTotal, items]);
  const discount = subtotal * couponPct;
  const total = Math.max(0, subtotal - discount) + shipping;

  useEffect(() => {
    const cep = (addr.cep || '').replace(/\D/g, '');
    if (cep.length !== 8) {
      setShipping(0);
      return;
    }
    let abort = false;
    setLookingUpCep(true);

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (abort) return;
        if (!data?.erro) {
          setAddr((a) => ({
            ...a,
            street: data.logradouro || a.street,
            city: data.localidade || a.city,
            state: data.uf || a.state,
          }));
          setShipping(24.4); // PAC 5–8 dias
        } else {
          setShipping(0);
        }
      })
      .catch(() => setShipping(0))
      .finally(() => !abort && setLookingUpCep(false));

    return () => {
      abort = true;
    };
  }, [addr.cep]);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    setCouponPct(code === 'JANE10' ? 0.1 : 0);
  };

  const finalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const linhasItens = items
      .map(
        (it) =>
          `• ${it.quantity} × ${it.name} — ${formatBRL(it.price * it.quantity)}`
      )
      .join('%0A');

    const msg =
      `*Novo pedido — Loja da Jane*%0A%0A` +
      `*Itens:*%0A${linhasItens}%0A%0A` +
      `*Subtotal:* ${formatBRL(subtotal)}%0A` +
      (couponPct > 0 ? `*Desconto:* -${formatBRL(discount)}%0A` : '') +
      `*Frete:* ${formatBRL(shipping)}%0A` +
      `*Total:* ${formatBRL(total)}%0A%0A` +
      `*Cliente:* ${addr.name}%0A` +
      `*Telefone:* ${addr.phone}%0A` +
      `*Endereço:* ${addr.street}, ${addr.number} — ${addr.city}/${addr.state}%0A` +
      (addr.complement ? `*Compl.:* ${addr.complement}%0A` : '') +
      `*CEP:* ${addr.cep}`;

    const url = `https://wa.me/${WHATS_NUMBER}?text=${msg}`;
    window.open(url, '_blank');

    // limpa carrinho após abrir o WhatsApp
    clear();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-semibold">Checkout</h1>

      {/* CARRINHO */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4">
        <h2 className="text-xl font-semibold mb-4">Carrinho</h2>

        {!items.length ? (
          <div className="text-neutral-300">Seu carrinho está vazio.</div>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={String(it.id)}
                className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{it.name}</p>
                  <p className="text-sm text-neutral-400">
                    {it.quantity} × {formatBRL(it.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="rounded-md bg-red-700 px-3 py-1 text-sm hover:bg-red-600"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg">
            <span className="text-neutral-300 mr-2">Total:</span>
            <strong>{formatBRL(subtotal)}</strong>
          </div>

          {items.length > 0 && (
            <button
              onClick={clear}
              className="rounded-md bg-neutral-700 px-3 py-2 text-sm hover:bg-neutral-600"
            >
              Limpar carrinho
            </button>
          )}
        </div>
      </section>

      {/* ENDEREÇO + PAGAMENTO */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-4">
        <h2 className="text-xl font-semibold mb-4">Endereço</h2>

        <form onSubmit={finalize} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-sm text-neutral-300">Nome *</span>
              <input
                required
                value={addr.name}
                onChange={(e) => setAddr({ ...addr, name: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-neutral-300">Telefone *</span>
              <input
                required
                value={addr.phone}
                onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-neutral-300">CEP *</span>
              <input
                required
                inputMode="numeric"
                value={addr.cep}
                onChange={(e) => setAddr({ ...addr, cep: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
              />
              {lookingUpCep && (
                <span className="text-xs text-neutral-400">Buscando endereço…</span>
              )}
            </label>

            <label className="space-y-1">
              <span className="text-sm text-neutral-300">Rua *</span>
              <input
                required
                value={addr.street}
                onChange={(e) => setAddr({ ...addr, street: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-neutral-300">Número *</span>
              <input
                required
                value={addr.number}
                onChange={(e) => setAddr({ ...addr, number: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-neutral-300">Cidade *</span>
              <input
                required
                value={addr.city}
                onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-neutral-300">Estado *</span>
              <input
                required
                value={addr.state}
                onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
              />
            </label>

            <label className="space-y-1 md:col-span-2">
              <span className="text-sm text-neutral-300">Complemento</span>
              <input
                value={addr.complement}
                onChange={(e) => setAddr({ ...addr, complement: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
              />
            </label>
          </div>

          {/* CUPOM */}
          <div className="rounded-xl border border-neutral-800 p-4 space-y-3">
            <h3 className="font-medium">Cupom de desconto</h3>
            <div className="flex gap-3">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="JANE10"
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 outline-none"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-lg bg-emerald-600 px-4 py-2 hover:bg-emerald-500"
              >
                Aplicar
              </button>
            </div>
          </div>

          {/* RESUMO */}
          <div className="rounded-xl border border-neutral-800 p-4 space-y-2">
            <h3 className="font-medium">Resumo</h3>
            <div className="flex justify-between text-sm text-neutral-300">
              <span>Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-300">
              <span>Desconto ({Math.round(couponPct * 100)}%)</span>
              <span>-{formatBRL(discount)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-300">
              <span>Frete • PAC (5–8 dias)</span>
              <span>{formatBRL(shipping)}</span>
            </div>
            <div className="mt-2 flex justify-between text-lg">
              <strong>Total:</strong>
              <strong>{formatBRL(total)}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-500"
            >
              Finalizar pedido
            </button>
            <Link
              href="/"
              className="rounded-xl border border-neutral-700 px-5 py-3 hover:bg-neutral-800/60"
            >
              Voltar para a loja
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}