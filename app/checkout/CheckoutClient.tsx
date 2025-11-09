'use client';

import React, { useEffect, useMemo, useState } from 'react';

// ✅ import absoluto usando o alias configurado no tsconfig
//    Se o seu CartProvider NÃO estiver nessa pasta, me fale que eu mando a linha certa.
import { useCart } from '@/components/providers/CartProvider';

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

type FreightOption = {
  id: 'PAC' | 'SEDEX';
  label: string;
  days: string;
  price: number;
};

const BRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    isFinite(value) ? value : 0
  );

const onlyDigits = (s: string) => s.replace(/\D/g, '');

export default function CheckoutClient() {
  // ⚠️ Qualquer estrutura do seu provider vai funcionar (tipado como any)
  const cart = (useCart as unknown as () => any)();

  const items: Array<{
    id?: string;
    slug?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }> = cart?.items ?? [];

  const subtotal = useMemo<number>(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((acc, it) => acc + (it?.price ?? 0) * (it?.quantity ?? 0), 0);
  }, [items]);

  // Cupom simples (ex.: JANE10 => 10%)
  const [coupon, setCoupon] = useState('');
  const discountPct = coupon.trim().toUpperCase() === 'JANE10' ? 10 : 0;
  const discountValue = useMemo(
    () => Math.round((subtotal * discountPct) / 100),
    [subtotal, discountPct]
  );

  // Frete
  const [freight, setFreight] = useState<FreightOption | null>(null);

  const freightOptions: FreightOption[] = useMemo(
    () => [
      { id: 'PAC', label: 'PAC', days: '5-8 dias', price: 2440 }, // R$ 24,40
      { id: 'SEDEX', label: 'SEDEX', days: '2-4 dias', price: 3890 } // R$ 38,90
    ],
    []
  );

  // Endereço
  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: ''
  });
  const [loadingCEP, setLoadingCEP] = useState(false);

  // Busca endereço automático ao digitar CEP válido
  useEffect(() => {
    const cep = onlyDigits(address.cep);
    if (cep.length !== 8) return;

    let active = true;
    const fetchAddress = async () => {
      try {
        setLoadingCEP(true);
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = (await res.json()) as
          | { erro?: boolean; logradouro?: string; localidade?: string; uf?: string }
          | undefined;

        if (!active || !data || (data as any).erro) return;

        setAddress(prev => ({
          ...prev,
          street: (data.logradouro ?? prev.street) as string,
          city: (data.localidade ?? prev.city) as string,
          state: (data.uf ?? prev.state) as string
        }));
      } catch {
        // silencia; sem toast pra garantir build
      } finally {
        if (active) setLoadingCEP(false);
      }
    };

    fetchAddress();
    return () => {
      active = false;
    };
  }, [address.cep]);

  const total = Math.max(0, subtotal - discountValue) + (freight?.price ?? 0);

  const removeItem = (idx: number) => {
    try {
      cart?.removeItem?.(items[idx]);
    } catch {
      // no-op
    }
  };

  const clearCart = () => {
    try {
      cart?.clearCart?.();
    } catch {
      // no-op
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode redirecionar / chamar sua API de pagamento
    alert(
      [
        'Pedido criado!',
        `Itens: ${items.length}`,
        `Subtotal: ${BRL(subtotal)}`,
        `Desconto: ${discountPct}%`,
        `Frete: ${freight ? `${freight.label} (${freight.days}) — ${BRL(freight.price / 100)}` : '—'}`,
        `Total: ${BRL(total / 100)}`,
        '',
        'Endereço:',
        `${address.name}`,
        `Tel: ${address.phone}`,
        `CEP: ${address.cep}`,
        `${address.street}, ${address.number}`,
        `${address.city} - ${address.state}`
      ].join('\n')
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      {/* CARRINHO */}
      <section className="mb-8 rounded-xl border border-white/10 bg-black/20 p-5">
        <h2 className="text-xl font-medium mb-4">Carrinho</h2>

        {items?.length ? (
          <div className="space-y-4">
            {items.map((it, idx) => (
              <div
                key={(it.id ?? it.slug ?? it.name) + idx}
                className="flex items-center gap-4 rounded-lg bg-white/5 p-4"
              >
                {/* imagem */}
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-white/10" />
                )}

                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm opacity-70">
                    {it.quantity} × {BRL(it.price / 100)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="rounded-md bg-rose-800/40 px-3 py-2 text-sm hover:bg-rose-800/60"
                >
                  Remover
                </button>
              </div>
            ))}

            <div className="mt-2 flex items-center justify-between">
              <p className="text-lg">
                Total: <span className="font-semibold">{BRL(subtotal / 100)}</span>
              </p>
              <button
                type="button"
                onClick={clearCart}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        ) : (
          <p className="opacity-70">Seu carrinho está vazio.</p>
        )}
      </section>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-8 md:grid-cols-2"
        autoComplete="on"
      >
        {/* Endereço */}
        <section className="rounded-xl border border-white/10 bg-black/20 p-5">
          <h2 className="text-xl font-medium mb-4">Endereço</h2>

          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm opacity-80">Nome *</label>
              <input
                required
                className="w-full rounded-lg bg-white/5 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-emerald-500/60"
                value={address.name}
                onChange={e => setAddress(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm opacity-80">Telefone *</label>
              <input
                required
                inputMode="tel"
                className="w-full rounded-lg bg-white/5 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-emerald-500/60"
                value={address.phone}
                onChange={e => setAddress(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm opacity-80">CEP *</label>
              <input
                required
                inputMode="numeric"
                placeholder="00000-000"
                className="w-full rounded-lg bg-white/5 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-emerald-500/60"
                value={address.cep}
                onChange={e => setAddress(prev => ({ ...prev, cep: e.target.value }))}
              />
              <p className="mt-1 text-xs opacity-60">
                {loadingCEP ? 'Buscando endereço…' : ' '}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm opacity-80">Rua *</label>
              <input
                required
                className="w-full rounded-lg bg-white/5 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-emerald-500/60"
                value={address.street}
                onChange={e => setAddress(prev => ({ ...prev, street: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm opacity-80">Número *</label>
                <input
                  required
                  className="w-full rounded-lg bg-white/5 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-emerald-500/60"
                  value={address.number}
                  onChange={e => setAddress(prev => ({ ...prev, number: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm opacity-80">Cidade *</label>
                <input
                  required
                  className="w-full rounded-lg bg-white/5 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-emerald-500/60"
                  value={address.city}
                  onChange={e => setAddress(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm opacity-80">Estado *</label>
              <input
                required
                className="w-full rounded-lg bg-white/5 px-3 py-2 uppercase outline-none ring-1 ring-white/10 focus:ring-emerald-500/60"
                value={address.state}
                onChange={e => setAddress(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>
        </section>

        {/* Pagamento / Resumo */}
        <section className="rounded-xl border border-white/10 bg-black/20 p-5">
          <h2 className="text-xl font-medium mb-4">Pagamento</h2>

          <div className="mb-6">
            <label className="mb-1 block text-sm opacity-80">Cupom de desconto</label>
            <div className="flex gap-2">
              <input
                placeholder="JANE10"
                className="flex-1 rounded-lg bg-white/5 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-emerald-500/60"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setCoupon(coupon.trim())}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500"
              >
                Aplicar
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-sm opacity-80">Frete</p>
            <div className="space-y-2">
              {freightOptions.map(opt => (
                <label key={opt.id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                  <input
                    type="radio"
                    name="freight"
                    checked={freight?.id === opt.id}
                    onChange={() => setFreight(opt)}
                  />
                  <span className="flex-1">
                    {opt.label} <span className="opacity-60">({opt.days})</span>
                  </span>
                  <span>{BRL(opt.price / 100)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white/5 p-4">
            <h3 className="mb-3 text-sm opacity-80">Resumo</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{BRL(subtotal / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto ({discountPct}%)</span>
                <span>-{BRL(discountValue / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete {freight ? `• ${freight.label} (${freight.days})` : ''}</span>
                <span>{freight ? BRL(freight.price / 100) : '—'}</span>
              </div>
              <hr className="my-2 border-white/10" />
              <div className="flex justify-between text-lg font-semibold">
                <span