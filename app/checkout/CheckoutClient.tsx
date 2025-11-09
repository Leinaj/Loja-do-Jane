'use client';

import React, { useEffect, useMemo, useState } from 'react';

// ✅ caminho relativo (CheckoutClient.tsx está em /app/checkout)
import { useCart } from '../providers/CartProvider';

// (opcional) se você já tiver um formatador no projeto, use-o no lugar
const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number.isFinite(value) ? value : 0,
  );

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

type ShippingOption = {
  id: 'PAC' | 'SEDEX';
  label: string;
  eta: string; // prazo
  price: number;
};

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'PAC', label: 'PAC', eta: '5-8 dias', price: 24.4 },
  { id: 'SEDEX', label: 'SEDEX', eta: '1-3 dias', price: 39.9 },
];

export default function CheckoutClient() {
  // Para evitar que diferenças de tipo do seu provider quebrem o build,
  // usamos 'any' ao extrair. Ajuste se seu provider já exporta os tipos.
  const { items = [], removeItem, clearCart } = (useCart() as any) ?? {};

  const subtotal = useMemo(() => {
    return Array.isArray(items)
      ? items.reduce(
          (acc: number, it: any) => acc + (Number(it?.price) || 0) * (Number(it?.quantity) || 0),
          0,
        )
      : 0;
  }, [items]);

  const [coupon, setCoupon] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [shippingId, setShippingId] = useState<ShippingOption['id']>('PAC');

  const selectedShipping =
    SHIPPING_OPTIONS.find((opt) => opt.id === shippingId) ?? SHIPPING_OPTIONS[0];

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

  const [fetchingCEP, setFetchingCEP] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // Preenche endereço pelo CEP (ViaCEP)
  useEffect(() => {
    const digits = addr.cep.replace(/\D/g, '');
    if (digits.length !== 8) return;

    let cancelled = false;
    setFetchingCEP(true);
    setCepError(null);

    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.erro) {
          setCepError('CEP não encontrado.');
          return;
        }
        setAddr((prev) => ({
          ...prev,
          street: data.logradouro ?? prev.street,
          city: data.localidade ?? prev.city,
          state: data.uf ?? prev.state,
        }));
      })
      .catch(() => !cancelled && setCepError('Falha ao buscar CEP.'))
      .finally(() => !cancelled && setFetchingCEP(false));

    return () => {
      cancelled = true;
    };
  }, [addr.cep]);

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    // Exemplo simples: JANE10 = 10% off
    if (code === 'JANE10') {
      setDiscountPct(10);
    } else {
      setDiscountPct(0);
    }
  }

  const discountValue = (subtotal * discountPct) / 100;
  const total = Math.max(0, subtotal - discountValue) + (selectedShipping?.price || 0);

  function handleChange<K extends keyof Address>(key: K, value: Address[K]) {
    setAddr((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validação mínima
    if (!addr.name || !addr.phone || !addr.cep || !addr.street || !addr.number || !addr.city || !addr.state) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!items?.length) {
      alert('Seu carrinho está vazio.');
      return;
    }

    // Aqui você enviaria os dados para sua API /pagamento
    console.log('Pedido:', {
      items,
      address: addr,
      coupon: coupon.trim().toUpperCase(),
      discountPct,
      shipping: selectedShipping,
      totals: { subtotal, discountValue, total },
    });

    alert('Pedido realizado! (simulação)');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      {/* CARRINHO */}
      <section className="mb-8 rounded-xl border border-white/10 bg-black/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Carrinho</h2>
          <button
            type="button"
            onClick={() => clearCart?.()}
            className="rounded-lg px-3 py-2 border border-white/15 hover:bg-white/5 transition"
          >
            Limpar carrinho
          </button>
        </div>

        {(!items || items.length === 0) && (
          <p className="text-white/70">Seu carrinho está vazio.</p>
        )}

        <ul className="space-y-3">
          {items?.map((it: any) => (
            <li
              key={String(it?.id)}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-black/10 p-3"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{it?.name ?? 'Produto'}</p>
                <p className="text-sm text-white/70">
                  {Number(it?.quantity) || 0} × {formatBRL(Number(it?.price) || 0)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeItem?.(it?.id)}
                className="rounded-lg px-3 py-2 bg-rose-700/70 hover:bg-rose-700 transition"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 text-right text-lg">
          <span className="text-white/70 mr-2">Subtotal:</span>
          <span className="font-semibold">{formatBRL(subtotal)}</span>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2" autoComplete="on">
        {/* Endereço */}
        <section className="rounded-xl border border-white/10 bg-black/20 p-5">
          <h3 className="text-lg font-medium mb-4">Endereço</h3>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-white/70">Nome *</span>
              <input
                className="rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                value={addr.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Telefone *</span>
              <input
                className="rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                value={addr.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">CEP *</span>
              <input
                className="rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                value={addr.cep}
                onChange={(e) => handleChange('cep', e.target.value)}
                placeholder="87020-550"
                required
              />
              <span className="text-xs text-white/60">
                {fetchingCEP ? 'Buscando endereço…' : cepError ?? ''}
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Rua *</span>
              <input
                className="rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                value={addr.street}
                onChange={(e) => handleChange('street', e.target.value)}
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-white/70">Número *</span>
                <input
                  className="rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                  value={addr.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-white/70">Complemento</span>
                <input
                  className="rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                  value={addr.complement ?? ''}
                  onChange={(e) => handleChange('complement', e.target.value)}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-white/70">Cidade *</span>
                <input
                  className="rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                  value={addr.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-white/70">Estado *</span>
                <input
                  className="rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                  value={addr.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
        </section>

        {/* Cupom / Frete / Resumo */}
        <section className="rounded-xl border border-white/10 bg-black/20 p-5 grid gap-6 h-fit">
          {/* Cupom */}
          <div>
            <h3 className="text-lg font-medium mb-3">Cupom de desconto</h3>
            <div className="flex gap-3">
              <input
                className="flex-1 rounded-lg bg-black/30 border border-white/15 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Ex.: JANE10"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-lg px-4 py-2 bg-emerald-600 hover:bg-emerald-500 transition"
              >
                Aplicar
              </button>
            </div>
            {discountPct > 0 && (
              <p className="text-sm text-emerald-400 mt-2">Desconto aplicado: {discountPct}%</p>
            )}
          </div>

          {/* Frete */}
          <div>
            <h3 className="text-lg font-medium mb-3">Frete</h3>
            <div className="grid gap-2">
              {SHIPPING_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center justify-between rounded-lg border border-white/15 px-3 py-2"
                >
                  <span>
                    {opt.label} <span className="text-white/60">({opt.eta})</span>
                  </span>
                  <span className="font-medium">{formatBRL(opt.price)}</span>
                  <input
                    type="radio"
                    name="shipping"
                    className="ml-3"
                    checked={shippingId === opt.id}
                    onChange={() => setShippingId(opt.id)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Resumo */}
          <div className="rounded-lg border border-white/10 p-4 grid gap-2">
            <h3 className="text-lg font-medium mb-1">Resumo</h3>
            <div className="flex justify-between text-sm text-white/80">
              <span>Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/80">
              <span>Desconto ({discountPct}%)</span>
              <span>-{formatBRL(discountValue)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/80">
              <span>
                Frete • {selectedShipping.label} ({selectedShipping.eta})
              </span>
              <span>{formatBRL(selectedShipping.price)}</span>
            </div>
            <hr className="my-2 border-white/10" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatBRL(total)}</span>
            </div>

            <button
              type="submit"
              className="mt-3 w-full rounded-lg px-4 py-3 bg-emerald-600 hover:bg-emerald-500 transition font-medium"
            >
              Finalizar pedido
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}