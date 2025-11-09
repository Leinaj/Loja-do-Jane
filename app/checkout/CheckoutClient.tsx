'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

// ✅ Import RELATIVO para não depender de alias '@/'
import { useCart } from '../../components/providers/CartProvider';

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number; // em R$
  qty: number;
  image?: string;
};

function formatMoney(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function onlyDigits(s: string) {
  return s.replace(/\D/g, '');
}

export default function CheckoutClient() {
  const { items, removeItem, clear, totalQty } = useCart();

  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
  });

  const [coupon, setCoupon] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [shippingName, setShippingName] = useState('PAC (5-8 dias)');
  const [shippingValue, setShippingValue] = useState(24.4); // valor simbólico

  const subtotal = useMemo(() => {
    return (items as CartItem[]).reduce((acc, it) => acc + it.price * it.qty, 0);
  }, [items]);

  const discountValue = useMemo(() => (subtotal * discountPct) / 100, [subtotal, discountPct]);

  const total = useMemo(() => {
    return Math.max(subtotal - discountValue, 0) + (items.length ? shippingValue : 0);
  }, [subtotal, discountValue, shippingValue, items.length]);

  // CEP → ViaCEP auto-preencher
  useEffect(() => {
    const digits = onlyDigits(address.cep);
    if (digits.length !== 8) return;

    let abort = false;

    async function fetchCep() {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (abort) return;
        if (data?.erro) return;

        setAddress((a) => ({
          ...a,
          street: data.logradouro ?? a.street,
          city: data.localidade ?? a.city,
          state: data.uf ?? a.state,
        }));

        // frete simbólico variável por UF só para ficar “real”
        const uf = String(data.uf || '').toUpperCase();
        const base = 22; // base
        const extra = ['AM', 'RR', 'AP', 'PA', 'RO', 'AC'].includes(uf) ? 18 : ['RS', 'PE', 'CE', 'RN', 'PB', 'AL', 'SE', 'BA', 'MA', 'PI'].includes(uf) ? 10 : 6;
        setShippingValue((base + extra) * 1.0);
      } catch {
        // silencioso
      }
    }

    fetchCep();
    return () => {
      abort = true;
    };
  }, [address.cep]);

  function applyCoupon() {
    const c = coupon.trim().toUpperCase();
    if (!c) {
      setDiscountPct(0);
      return;
    }
    // Regras simples de exemplo
    if (c === 'JANE10') {
      setDiscountPct(10);
    } else if (c === 'JANE15' && subtotal >= 300) {
      setDiscountPct(15);
    } else {
      setDiscountPct(0);
    }
  }

  function onChange<K extends keyof Address>(key: K, value: Address[K]) {
    setAddress((a) => ({ ...a, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-white">Checkout</h1>

      {/* Carrinho */}
      <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-medium text-white">Carrinho</h2>

        <div className="space-y-4">
          {(items as CartItem[]).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-white/10" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-white">{item.name}</p>
                  <p className="text-sm text-white/70">
                    {item.qty} × {formatMoney(item.price)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="rounded-xl bg-rose-900/60 px-3 py-2 text-sm font-medium text-rose-50 hover:bg-rose-900"
              >
                Remover
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-white/70">Seu carrinho está vazio.</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-white">
            Total itens: <span className="font-semibold">{formatMoney(subtotal)}</span>
          </p>
          <button
            onClick={() => clear()}
            disabled={!items.length}
            className="rounded-xl border border-white/10 px-4 py-2 text-white/90 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Limpar carrinho
          </button>
        </div>
      </section>

      {/* Endereço */}
      <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-medium text-white">Endereço</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-2">
            <label className="mb-1 block text-sm text-white/80">Nome *</label>
            <input
              value={address.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-emerald-500/30 focus:ring"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Telefone *</label>
            <input
              value={address.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-emerald-500/30 focus:ring"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">CEP *</label>
            <input
              value={address.cep}
              onChange={(e) => onChange('cep', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-emerald-500/30 focus:ring"
              placeholder="00000-000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-white/80">Rua *</label>
            <input
              value={address.street}
              onChange={(e) => onChange('street', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-emerald-500/30 focus:ring"
              placeholder="Rua / Avenida"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Número *</label>
            <input
              value={address.number}
              onChange={(e) => onChange('number', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-emerald-500/30 focus:ring"
              placeholder="Nº"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Cidade *</label>
            <input
              value={address.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-emerald-500/30 focus:ring"
              placeholder="Cidade"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Estado *</label>
            <input
              value={address.state}
              onChange={(e) => onChange('state', e.target.value.toUpperCase())}
              maxLength={2}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-emerald-500/30 focus:ring"
              placeholder="UF"
            />
          </div>
        </div>
      </section>

      {/* Cupom / Frete / Resumo */}
      <section className="mb-8 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <h3 className="mb-3 text-lg font-medium text-white">Cupom de desconto</h3>
          <div className="flex gap-3">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="EX.: JANE10"
              className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none ring-emerald-500/30 focus:ring"
            />
            <button
              onClick={applyCoupon}
              className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
            >
              Aplicar
            </button>
          </div>
          {discountPct > 0 && (
            <p className="mt-2 text-sm text-emerald-300">
              Cupom aplicado: {discountPct}% de desconto.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <h3 className="mb-3 text-lg font-medium text-white">Frete</h3>
          <div className="flex items-center justify-between">
            <p className="text-white/90">{shippingName}</p>
            <p className="text-emerald-400">{formatMoney(shippingValue)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <h3 className="mb-3 text-lg font-medium text-white">Resumo</h3>

          <div className="space-y-2 text-white/90">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Desconto ({discountPct}%)</span>
              <span>-{formatMoney(discountValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Frete • {shippingName}</span>
              <span>{items.length ? formatMoney(shippingValue) : formatMoney(0)}</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex items-center justify-between text-lg font-semibold text-white">
              <span>Total:</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          <button
            disabled={!items.length || !address.name || !address.cep || !address.street || !address.number || !address.city || !address.state}
            className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-center text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Finalizar pedido
          </button>

          <Link
            href="/"
            className="mt-3 block w-full rounded-xl border border-white/10 px-4 py-3 text-center text-white/90 hover:bg-white/10"
          >
            Voltar para a loja
          </Link>
        </div>
      </section>
    </div>
  );
}