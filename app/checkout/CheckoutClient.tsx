'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/lib/cart';
import { toast } from '@/components/ui/toast';

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

const SHIPPING_FIXED = 24.4; // <<< Troque aqui se quiser outro valor
const COUPON_CODE = 'JANE10';
const COUPON_DISCOUNT = 0.1; // 10%

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CheckoutClient() {
  const { items, clear } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const [addr, setAddr] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
  });

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  const discount = couponApplied ? subtotal * COUPON_DISCOUNT : 0;
  const shipping = items.length > 0 ? SHIPPING_FIXED : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  // CEP auto-preenchimento (ViaCEP)
  useEffect(() => {
    const digits = addr.cep.replace(/\D/g, '');
    if (digits.length !== 8) return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        const data = await res.json();
        if (data?.erro) return;

        setAddr((a) => ({
          ...a,
          street: data.logradouro ?? a.street,
          city: data.localidade ?? a.city,
          state: data.uf ?? a.state,
        }));
      } catch {
        /* ignore */
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addr.cep]);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === COUPON_CODE && !couponApplied) {
      setCouponApplied(true);
      toast({
        title: 'Cupom aplicado!',
        description: `Desconto de ${Math.round(COUPON_DISCOUNT * 100)}% aplicado com sucesso.`,
      });
    } else {
      toast({
        title: 'Cupom inválido',
        description: 'Verifique o código e tente novamente.',
      });
    }
  };

  const finishOrder = () => {
    if (!addr.name || !addr.phone || !addr.cep || !addr.street || !addr.number || !addr.city || !addr.state) {
      toast({
        title: 'Dados incompletos',
        description: 'Preencha todos os campos obrigatórios.',
      });
      return;
    }

    toast({
      title: 'Pedido realizado!',
      description: 'Você receberá a confirmação no seu WhatsApp.',
    });

    clear();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Carrinho */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <h2 className="text-xl font-semibold mb-4">Carrinho</h2>
        <div className="space-y-3">
          {items.length === 0 && (
            <div className="text-white/60">Seu carrinho está vazio.</div>
          )}

          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between rounded-2xl bg-black/20 p-3"
            >
              <div className="flex items-center gap-3">
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-white/10" />
                )}
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-white/70">
                    {it.quantity} × {brl(it.price)}
                  </div>
                </div>
              </div>
              <div className="text-white/90 font-semibold">
                {brl(it.price * it.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg">
            Total:{' '}
            <span className="font-semibold text-emerald-400">
              {brl(subtotal)}
            </span>
          </div>
          <button
            type="button"
            onClick={clear}
            className="rounded-2xl border border-white/10 px-4 py-2 text-white/80 hover:text-white"
          >
            Limpar carrinho
          </button>
        </div>
      </section>

      {/* Endereço */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur space-y-4">
        <h2 className="text-xl font-semibold">Endereço</h2>

        <Field
          label="Nome *"
          value={addr.name}
          onChange={(v) => setAddr((a) => ({ ...a, name: v }))}
        />
        <Field
          label="Telefone *"
          value={addr.phone}
          onChange={(v) => setAddr((a) => ({ ...a, phone: v }))}
          inputMode="tel"
        />
        <Field
          label="CEP *"
          value={addr.cep}
          onChange={(v) =>
            setAddr((a) => ({ ...a, cep: v.replace(/\D/g, '').slice(0, 8) }))
          }
          placeholder="Somente números"
          inputMode="numeric"
        />
        <div className="text-sm text-white/50 -mt-2">Buscando endereço…</div>
        <Field
          label="Rua *"
          value={addr.street}
          onChange={(v) => setAddr((a) => ({ ...a, street: v }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Número *"
            value={addr.number}
            onChange={(v) => setAddr((a) => ({ ...a, number: v }))}
          />
          <Field
            label="Cidade *"
            value={addr.city}
            onChange={(v) => setAddr((a) => ({ ...a, city: v }))}
          />
        </div>
        <Field
          label="Estado *"
          value={addr.state}
          onChange={(v) => setAddr((a) => ({ ...a, state: v }))}
        />
      </section>

      {/* Cupom / Frete / Resumo */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur space-y-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <Field
            label="Cupom de desconto"
            value={coupon}
            onChange={setCoupon}
            placeholder={COUPON_CODE}
          />
          <button
            type="button"
            onClick={applyCoupon}
            className="h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-6 font-semibold text-white transition"
          >
            Aplicar
          </button>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between py-1">
            <span>Subtotal</span>
            <span>{brl(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span>Desconto ({couponApplied ? '10%' : '0%'})</span>
            <span>-{brl(discount)}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span>Frete • PAC (5–8 dias)</span>
            <span>{brl(shipping)}</span>
          </div>
          <div className="mt-2 border-t border-white/10 pt-2 flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-emerald-400">{brl(total)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={finishOrder}
          className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
        >
          Finalizar pedido
        </button>

        <a
          href="/"
          className="block w-full h-12 rounded-2xl border border-white/10 text-white/80 hover:text-white grid place-items-center transition"
        >
          Voltar para a loja
        </a>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm text-white/70">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="h-12 w-full rounded-2xl bg-white/5 px-4 outline-none ring-0 border border-white/10 focus:border-emerald-400/40 transition"
      />
    </label>
  );
}