'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { maskCEP, maskPhoneBR, isCEPValid } from '@/utils/mask';
import { formatBRL, saneShipping, tryFixCents } from '@/utils/format';
import { useCep } from '@/hooks/useCep';

// ⚠️ AJUSTE este import se o seu hook do carrinho estiver em outro caminho
import { useCart } from '@/components/cart/CartContext';

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

export default function CheckoutClient() {
  const { items, removeItem, clear, subtotal } = useCart(); // supõe que já exista
  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
    complement: '',
  });

  // frete (null quando inválido/indefinido)
  const [shipping, setShipping] = useState<number | null>(null);
  const [shippingLabel, setShippingLabel] = useState('PAC (5-8 dias)');

  // CEP → ViaCEP
  const { data: cepData, loading: cepLoading } = useCep(address.cep);

  // Preenche endereço quando CEP válido retorna
  useEffect(() => {
    if (cepData) {
      const street = [cepData.logradouro, cepData.bairro].filter(Boolean).join(' - ');
      setAddress((a) => ({
        ...a,
        street,
        city: cepData.localidade || '',
        state: cepData.uf || '',
      }));
    }
  }, [cepData]);

  // Quando CEP fica válido, simule/obtenha frete real
  useEffect(() => {
    if (!isCEPValid(address.cep)) {
      setShipping(null);
      return;
    }
    // TODO: trocar pela sua chamada real de frete
    // Exemplo de simulação:
    const priceFromApi: unknown = 24.4; // 24,40
    const fixed = tryFixCents(priceFromApi);
    const sane = saneShipping(fixed ?? priceFromApi);
    setShipping(sane); // null se inválido
  }, [address.cep]);

  const total = useMemo(() => {
    return subtotal + (shipping ?? 0);
  }, [subtotal, shipping]);

  function handleChange<K extends keyof Address>(key: K, value: string) {
    setAddress((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Carrinho */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Carrinho</h2>

        <ul className="space-y-3">
          {items.map((it: any) => (
            <li
              key={it.id}
              className="flex items-center justify-between rounded-xl bg-white/5 p-3"
            >
              <div className="flex items-center gap-3">
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-white/70">
                    {it.qty} × {formatBRL(it.price)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeItem(it.id)}
                className="rounded-xl bg-rose-900/50 px-3 py-2 text-sm font-medium hover:bg-rose-900/70"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg">
            Total:{' '}
            <span className="font-semibold text-emerald-400">{formatBRL(subtotal)}</span>
          </p>
          <button
            onClick={clear}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Limpar carrinho
          </button>
        </div>
      </section>

      {/* Endereço */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm text-white/80">Nome *</label>
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={address.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Telefone *</label>
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={address.phone}
              onChange={(e) => handleChange('phone', maskPhoneBR(e.target.value))}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">CEP *</label>
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={address.cep}
              onChange={(e) => handleChange('cep', maskCEP(e.target.value))}
              placeholder="00000-000"
            />
            {address.cep && (
              <p className="mt-1 text-xs text-white/50">
                {cepLoading ? 'Buscando endereço…' : (address.street ? '' : 'CEP válido, preencha o número')}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-white/80">Rua *</label>
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={address.street}
              onChange={(e) => handleChange('street', e.target.value)}
              placeholder="Rua / Avenida"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Número *</label>
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={address.number}
              onChange={(e) => handleChange('number', e.target.value)}
              placeholder="Número"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Cidade *</label>
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={address.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Cidade"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Estado *</label>
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 uppercase outline-none"
              value={address.state}
              onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
              placeholder="UF"
              maxLength={2}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-white/80">Complemento</label>
            <input
              className="w-full rounded-xl bg-white/10 px-3 py-2 outline-none"
              value={address.complement ?? ''}
              onChange={(e) => handleChange('complement', e.target.value)}
              placeholder="Apto / Referência (opcional)"
            />
          </div>
        </div>
      </section>

      {/* Cupom + Frete */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-white/80">Cupom de desconto</label>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl bg-white/10 px-3 py-2 outline-none"
                placeholder="JANE10"
              />
              <button className="rounded-xl bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-700">
                Aplicar
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Frete</label>
            <div className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2">
              <span>{shippingLabel}</span>
              <span className="font-semibold text-emerald-400">
                {shipping ? formatBRL(shipping) : '—'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Resumo */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold mb-4">Resumo</h2>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/80">Desconto (0%)</span>
            <span>- {formatBRL(0)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/80">Frete • {shippingLabel}</span>
            <span>{shipping ? formatBRL(shipping) : '—'}</span>
          </div>

          <div className="mt-3 border-t border-white/10 pt-3 flex items-center justify-between text-lg">
            <span className="text-white/90">Total:</span>
            <span className="font-semibold text-emerald-400">{formatBRL(total)}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <button className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-700">
            Finalizar pedido
          </button>
          <a
            href="/"
            className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-center hover:bg-white/5"
          >
            Voltar para a loja
          </a>
        </div>
      </section>
    </div>
  );
}