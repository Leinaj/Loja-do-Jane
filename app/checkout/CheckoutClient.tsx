'use client';

import React, { useEffect, useMemo, useState } from 'react';
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

const currency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const FREIGHT_PAC = 24.4; // R$ 24,40

export default function CheckoutClient() {
  const { items, removeItem, clear } = useCart();

  // ------- Resumo / Totais -------
  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  );

  const [coupon, setCoupon] = useState('JANE10');
  const [discountPct, setDiscountPct] = useState(0);
  const discountValue = useMemo(
    () => subtotal * (discountPct / 100),
    [subtotal, discountPct]
  );

  const total = useMemo(
    () => Math.max(0, subtotal - discountValue) + (items.length ? FREIGHT_PAC : 0),
    [subtotal, discountValue, items.length]
  );

  // ------- Endereço -------
  const [loadingCep, setLoadingCep] = useState(false);
  const [addr, setAddr] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
  });

  function setField<K extends keyof Address>(key: K, value: Address[K]) {
    setAddr((a) => ({ ...a, [key]: value }));
  }

  // Busca automática do endereço ao digitar CEP completo (8 dígitos)
  useEffect(() => {
    const digits = addr.cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    setLoadingCep(true);

    // ViaCEP
    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.erro) return;
        setAddr((a) => ({
          ...a,
          street: data.logradouro ?? a.street,
          city: data.localidade ?? a.city,
          state: data.uf ?? a.state,
        }));
      })
      .finally(() => setLoadingCep(false));
  }, [addr.cep]);

  // ------- Cupom -------
  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    // Exemplo simples de cupons
    if (code === 'JANE10') {
      setDiscountPct(10);
    } else if (code === 'JANE15') {
      setDiscountPct(15);
    } else {
      setDiscountPct(0);
    }
  }

  function finalizeOrder() {
    if (!addr.name || !addr.phone || !addr.cep || !addr.street || !addr.number || !addr.city || !addr.state) {
      alert('Preencha todos os campos obrigatórios do endereço.');
      return;
    }
    alert('Pedido finalizado! (exemplo)');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* Carrinho */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Carrinho</h2>

        {items.length === 0 ? (
          <p className="opacity-70">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-4 rounded-xl bg-black/30 p-3"
                >
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={it.name}
                      src={it.image}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-white/10" />
                  )}

                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-sm opacity-70">
                      {it.qty} × {currency(it.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(it.id)}
                    className="rounded-lg bg-rose-900/50 px-3 py-2 text-sm hover:bg-rose-900/70"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg">
                Total: <span className="font-semibold">{currency(subtotal)}</span>
              </p>
              <button
                onClick={clear}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              >
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </section>

      {/* Endereço */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Endereço</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm opacity-80">Nome *</label>
            <input
              className="w-full rounded-xl bg-black/40 px-4 py-3 outline-none"
              value={addr.name}
              onChange={(e) => setField('name', e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm opacity-80">Telefone *</label>
            <input
              className="w-full rounded-xl bg-black/40 px-4 py-3 outline-none"
              value={addr.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm opacity-80">CEP *</label>
            <input
              className="w-full rounded-xl bg-black/40 px-4 py-3 outline-none"
              placeholder="00000-000"
              value={addr.cep}
              onChange={(e) => setField('cep', e.target.value)}
            />
            <p className="mt-1 text-xs opacity-60">
              {loadingCep ? 'Buscando endereço…' : '\u00A0'}
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm opacity-80">Rua *</label>
            <input
              className="w-full rounded-xl bg-black/40 px-4 py-3 outline-none"
              value={addr.street}
              onChange={(e) => setField('street', e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm opacity-80">Número *</label>
            <input
              className="w-full rounded-xl bg-black/40 px-4 py-3 outline-none"
              value={addr.number}
              onChange={(e) => setField('number', e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm opacity-80">Cidade *</label>
            <input
              className="w-full rounded-xl bg-black/40 px-4 py-3 outline-none"
              value={addr.city}
              onChange={(e) => setField('city', e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm opacity-80">Estado *</label>
            <input
              className="w-full rounded-xl bg-black/40 px-4 py-3 outline-none"
              value={addr.state}
              onChange={(e) => setField('state', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Cupom */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Cupom de desconto</h2>
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-xl bg-black/40 px-4 py-3 outline-none"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Ex.: JANE10"
          />
          <button
            onClick={applyCoupon}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-700"
          >
            Aplicar
          </button>
        </div>
        {discountPct > 0 && (
          <p className="mt-2 text-sm opacity-80">
            Cupom aplicado: <b>{discountPct}%</b> de desconto.
          </p>
        )}
      </section>

      {/* Frete / Resumo */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Frete</h3>
          <div className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3">
            <span>PAC (5–8 dias)</span>
            <span className="font-semibold">{currency(items.length ? FREIGHT_PAC : 0)}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Resumo</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Desconto ({discountPct}%)</span>
              <span>-{currency(discountValue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete • PAC (5–8 dias)</span>
              <span>{currency(items.length ? FREIGHT_PAC : 0)}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-lg">
            <span className="opacity-80">Total:</span>
            <span className="font-semibold">{currency(total)}</span>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            onClick={finalizeOrder}
            className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-700"
            disabled={items.length === 0}
          >
            Finalizar pedido
          </button>
          <a
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center hover:bg-white/10"
          >
            Voltar para a loja
          </a>
        </div>
      </section>
    </div>
  );
}
```0