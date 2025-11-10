'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/components/cart/context';

type CheckoutInfo = {
  name: string; phone: string; cep: string;
  street: string; number: string; complement: string;
  district: string; city: string; state: string;
};

const DEFAULT_INFO: CheckoutInfo = {
  name: 'JANIEL BATISTA DOS SANTOS',
  phone: '44988606483',
  cep: '',
  street: '', number: '69', complement: '',
  district: '', city: 'Maringá', state: 'PR',
};
const STORAGE_KEY = 'checkoutInfo';

export default function CheckoutPage() {
  const { items, total, removeItem, clearCart } = useCart();

  const initial = useMemo<CheckoutInfo>(() => {
    if (typeof window === 'undefined') return DEFAULT_INFO;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_INFO, ...JSON.parse(saved) } : DEFAULT_INFO;
    } catch { return DEFAULT_INFO; }
  }, []);

  const [info, setInfo] = useState<CheckoutInfo>(initial);
  const onChange = (k: keyof CheckoutInfo) => (e: any) =>
    setInfo((s) => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    }
  }, [info]);

  /* === CEP -> ViaCEP === */
  useEffect(() => {
    const cep = info.cep?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.erro) {
            setInfo((s) => ({
              ...s,
              street: data.logradouro || s.street,
              district: data.bairro || s.district,
              city: data.localidade || s.city,
              state: data.uf || s.state,
            }));
          }
        })
        .catch(() => {});
    }
  }, [info.cep]);

  /* === WhatsApp === */
  const waHref = useMemo(() => {
    const lines = [
      '*Novo pedido*',
      ...items.map(
        (it) => `- ${it.quantity} × ${it.name} — R$ ${(it.price * it.quantity).toFixed(2).replace('.', ',')}`
      ),
      `*Total:* R$ ${total.toFixed(2).replace('.', ',')}`,
      '',
      '*Dados do cliente*',
      `Nome: ${info.name}`,
      `Telefone: ${info.phone}`,
      `CEP: ${info.cep}`,
      `Endereço: ${info.street}, ${info.number} ${info.complement ? ' - ' + info.complement : ''}`,
      `Bairro: ${info.district}`,
      `Cidade/UF: ${info.city}/${info.state}`,
    ].join('\n');

    const number = '5544988606483';
    return `https://wa.me/${number}?text=${encodeURIComponent(lines)}`;
  }, [items, total, info]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Carrinho */}
      <section className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Carrinho</h1>

        {items.length === 0 ? (
          <div className="rounded-xl border border-white/10 p-6 text-center">
            <p className="mb-4 opacity-80">Seu carrinho está vazio.</p>
            <Link href="/" className="inline-block rounded-full bg-emerald-600 text-white px-5 py-2">
              Voltar para a loja
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-neutral-800 p-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-700">
                    <Image src={it.image} alt={it.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm opacity-80">
                      {it.quantity} × R$ {it.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      R$ {(it.price * it.quantity).toFixed(2).replace('.', ',')}
                    </div>
                    <button
                      onClick={() => removeItem(it.id)}
                      className="mt-2 rounded-full bg-rose-700/70 px-3 py-1 text-sm text-white"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-lg">
                <span className="opacity-80">Total: </span>
                <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
              </div>
              <button onClick={clearCart} className="rounded-full border border-white/15 px-4 py-2">
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </section>

      {/* Endereço / Dados */}
      <section className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm opacity-80">Nome *</span>
            <input className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-3"
              value={info.name} onChange={onChange('name')} />
          </label>

          <label className="block">
            <span className="text-sm opacity-80">Telefone *</span>
            <input className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-3"
              value={info.phone} onChange={onChange('phone')} />
          </label>

          <label className="block">
            <span className="text-sm opacity-80">CEP *</span>
            <input className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-3"
              value={info.cep} onChange={onChange('cep')} placeholder="Somente números" />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm opacity-80">Rua *</span>
            <input className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-3"
              value={info.street} onChange={onChange('street')} />
          </label>

          <label className="block">
            <span className="text-sm opacity-80">Número *</span>
            <input className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-3"
              value={info.number} onChange={onChange('number')} />
          </label>

          <label className="block">
            <span className="text-sm opacity-80">Complemento</span>
            <input className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-3"
              value={info.complement} onChange={onChange('complement')} />
          </label>

          <label className="block">
            <span className="text-sm opacity-80">Bairro *</span>
            <input className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-3"
              value={info.district} onChange={onChange('district')} />
          </label>

          <label className="block">
            <span className="text-sm opacity-80">Cidade *</span>
            <input className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-3"
              value={info.city} onChange={onChange('city')} />
          </label>

          <label className="block">
            <span className="text-sm opacity-80">Estado *</span>
            <input className="mt-1 w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-3"
              value={info.state} onChange={onChange('state')} />
          </label>
        </div>

        {/* Finalizar compra (WhatsApp) */}
        <a
          href={waHref}
          target="_blank"
          className="mt-4 inline-block rounded-full bg-emerald-600 text-white px-6 py-3 text-lg"
        >
          Finalizar compra no WhatsApp
        </a>
      </section>
    </main>
  );
}