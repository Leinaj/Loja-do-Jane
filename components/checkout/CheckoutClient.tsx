'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/lib/cart';
import CouponField from '@/components/cart/CouponField';
import ShippingCalc from '@/components/cart/ShippingCalc';
import Link from 'next/link';

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

export default function CheckoutClient() {
  const { items, remove, clear, total } = useCart();

  // valores em reais (mantendo o seu padrão atual)
  const [discountPercent, setDiscountPercent] = useState(0);
  const [shippingValue, setShippingValue] = useState(0);
  const [shippingLabel, setShippingLabel] = useState<string>('Calcular frete');

  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
  });

  // --------- CEP AUTOFILL (ViaCEP)
  useEffect(() => {
    const limpo = (address.cep || '').replace(/\D/g, '');
    if (limpo.length !== 8) return;

    let cancel = false;
    async function run() {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
        const data = await res.json();
        if (!cancel && !data?.erro) {
          setAddress((a) => ({
            ...a,
            street: data.logradouro || a.street,
            city: data.localidade || a.city,
            state: data.uf || a.state,
          }));
        }
      } catch {}
    }
    run();
    return () => {
      cancel = true;
    };
  }, [address.cep]);

  // --------- TOTAIS
  const subtotal = useMemo(() => total, [total]);
  const desconto = useMemo(() => (subtotal * discountPercent) / 100, [subtotal, discountPercent]);
  const totalFinal = useMemo(() => Math.max(0, subtotal - desconto + shippingValue), [subtotal, desconto, shippingValue]);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[2fr_1fr]">
      {/* Coluna esquerda */}
      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-semibold">Carrinho</h2>

          <div className="space-y-3">
            {items.length === 0 && <p className="text-white/60">Seu carrinho está vazio.</p>}

            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between rounded-2xl bg-black/30 p-3 ring-1 ring-white/5"
              >
                <div className="flex items-center gap-3">
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt={it.name} className="h-12 w-12 rounded-xl object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-white/5" />
                  )}
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-white/60">
                      {it.quantity} × {it.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => remove(it.id)}
                  className="rounded-xl bg-rose-600/20 px-3 py-2 text-sm font-medium text-rose-200 hover:bg-rose-600/30"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-lg">
              Total:{' '}
              <span className="font-semibold text-emerald-300">
                {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <button
              onClick={clear}
              disabled={items.length === 0}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
            >
              Limpar carrinho
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-semibold">Endereço</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Nome *"
              value={address.name}
              onChange={(v) => setAddress({ ...address, name: v })}
              className="sm:col-span-2"
            />
            <Input label="Telefone *" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
            <Input label="CEP *" value={address.cep} onChange={(v) => setAddress({ ...address, cep: v })} />

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm text-white/50">Buscando endereço…</p>
              <Input
                label="Rua *"
                value={address.street}
                onChange={(v) => setAddress({ ...address, street: v })}
                className="mb-3"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input label="Número *" value={address.number} onChange={(v) => setAddress({ ...address, number: v })} />
                <Input label="Cidade *" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                <Input label="Estado *" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Coluna direita (resumo) */}
      <aside className="space-y-4">
        <CouponField
          onApply={(percent) => {
            setDiscountPercent(percent);
          }}
        />

        <ShippingCalc
          subtotal={Math.round(subtotal * 100) / 100}
          cep={address.cep}
          onFreight={(valor, label) => {
            setShippingValue(valor / 100); // valor veio em centavos no componente (ajuste aqui se já usa reais)
            setShippingLabel(label);
          }}
        />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-sm font-medium text-white/80">Resumo</div>
          <ResumoRow label="Subtotal" value={subtotal} />
          <ResumoRow label={`Desconto (${discountPercent}% )`} value={-desconto} />
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Frete • {shippingLabel}</span>
            <span>
              {shippingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3 text-lg">
            Total:{' '}
            <span className="font-semibold text-emerald-300">
              {totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          <button className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-base font-semibold text-black hover:bg-emerald-500">
            Finalizar pedido
          </button>

          <Link
            href="/"
            className="mt-3 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white/80 hover:bg-white/10"
          >
            Voltar para a loja
          </Link>
        </div>
      </aside>
    </div>
  );
}

// ------------------ UI helpers ------------------
function Input({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className || ''}`}>
      <span className="mb-1 block text-sm text-white/70">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
      />
    </label>
  );
}

function ResumoRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-1 flex items-center justify-between text-sm text-white/70">
      <span>{label}</span>
      <span className={value < 0 ? 'text-rose-200' : ''}>
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
    </div>
  );
}