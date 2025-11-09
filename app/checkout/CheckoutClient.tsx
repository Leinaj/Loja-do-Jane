'use client';

import React, { useEffect, useMemo, useState } from 'react';

// ✅ caminho relativo (CheckoutClient.tsx fica em /app/checkout)
import { useCart } from '../providers/CartProvider';

// (opcional) se tiver um formatador já no projeto, troque por ele
const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

const DEFAULT_FREIGHT = 24.4; // PAC (5–8 dias) — ajuste se quiser
const COUPON_CODE = 'JANE10';
const COUPON_DISCOUNT = 0.1; // 10%

export default function CheckoutClient() {
  const { items, total, removeItem, clearCart } = useCart();

  // ---- Formulário / estado ----
  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
  });
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const [freightSelected] = useState<'PAC'>('PAC'); // só 1 opção visível por enquanto
  const freightValue = DEFAULT_FREIGHT;

  // ---- CEP → ViaCEP ----
  useEffect(() => {
    // limpa tudo quando o CEP muda para algo curto
    if (address.cep.replace(/\D/g, '').length < 8) {
      setCouponApplied((prev) => prev); // sem efeito, apenas evitando TS "unused"
      return;
    }

    const fetchCep = async () => {
      try {
        setIsFetchingCep(true);
        const onlyDigits = address.cep.replace(/\D/g, '');
        const res = await fetch(`https://viacep.com.br/ws/${onlyDigits}/json/`);
        const data = await res.json();

        if (data?.erro) {
          setIsFetchingCep(false);
          return;
        }

        setAddress((prev) => ({
          ...prev,
          street: data.logradouro ?? prev.street,
          city: data.localidade ?? prev.city,
          state: data.uf ?? prev.state,
        }));
      } catch {
        // silencioso; poderia exibir um toast de erro se preferir
      } finally {
        setIsFetchingCep(false);
      }
    };

    fetchCep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.cep]);

  // ---- Totais ----
  const subtotal = useMemo(() => total, [total]);
  const discount = useMemo(
    () => (couponApplied ? subtotal * COUPON_DISCOUNT : 0),
    [couponApplied, subtotal]
  );
  const grandTotal = useMemo(
    () => Math.max(0, subtotal - discount) + (items.length ? freightValue : 0),
    [subtotal, discount, freightValue, items.length]
  );

  // ---- Handlers ----
  const onChange = (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const applyCoupon = () => {
    if (!coupon) return;
    if (coupon.toUpperCase().trim() === COUPON_CODE && !couponApplied) {
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
    }
  };

  const finalizeOrder = () => {
    // Validações simples
    if (!items.length) {
      alert('Seu carrinho está vazio.');
      return;
    }
    if (!address.name || !address.phone || !address.cep || !address.street || !address.number || !address.city || !address.state) {
      alert('Preencha todos os campos obrigatórios do endereço.');
      return;
    }

    // Aqui você poderia:
    // - Chamar seu backend / endpoint de pagamento
    // - Redirecionar para uma página de confirmação
    // Por enquanto, apenas simulamos:
    alert('Pedido finalizado com sucesso!');
    clearCart();
  };

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8 space-y-8">
      {/* Carrinho */}
      <section className="rounded-2xl bg-[#0e1a16] border border-white/5 shadow-lg p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Carrinho</h2>

        {items.length === 0 ? (
          <p className="text-white/70">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-3 md:p-4"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    {it.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.image}
                        alt={it.name}
                        className="h-14 w-14 md:h-16 md:w-16 rounded-xl object-cover bg-black/20"
                      />
                    )}
                    <div>
                      <p className="font-medium">{it.name}</p>
                      <p className="text-white/70 text-sm">
                        {it.quantity} × {formatBRL(it.price)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(it.id)}
                    className="rounded-xl bg-red-900/40 hover:bg-red-900/60 text-red-200 px-4 py-2 transition"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-lg">
                Total:{' '}
                <span className="font-semibold text-emerald-400">
                  {formatBRL(subtotal)}
                </span>
              </p>

              <button
                onClick={clearCart}
                className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/5 transition"
              >
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </section>

      {/* Endereço */}
      <section className="rounded-2xl bg-[#0e1a16] border border-white/5 shadow-lg p-4 md:p-6 space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/70">Nome *</label>
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={address.name}
              onChange={onChange('name')}
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Telefone *</label>
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={address.phone}
              onChange={onChange('phone')}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">CEP *</label>
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={address.cep}
              onChange={onChange('cep')}
              placeholder="00000-000"
            />
            <p className="text-xs text-white/60">
              {isFetchingCep ? 'Buscando endereço…' : ' '}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Rua *</label>
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={address.street}
              onChange={onChange('street')}
              placeholder="Nome da rua"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Número *</label>
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={address.number}
              onChange={onChange('number')}
              placeholder="Nº"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Cidade *</label>
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={address.city}
              onChange={onChange('city')}
              placeholder="Cidade"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Estado *</label>
            <input
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={address.state}
              onChange={onChange('state')}
              placeholder="UF"
            />
          </div>
        </div>
      </section>

      {/* Cupom + Frete */}
      <section className="rounded-2xl bg-[#0e1a16] border border-white/5 shadow-lg p-4 md:p-6 space-y-6">
        {/* Cupom */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Cupom de desconto</h3>
          <div className="flex items-center gap-3">
            <input
              className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Ex.: JANE10"
            />
            <button
              onClick={applyCoupon}
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 font-medium transition"
            >
              Aplicar
            </button>
          </div>
          {couponApplied ? (
            <p className="text-sm text-emerald-400">Cupom aplicado: {COUPON_CODE} (10%).</p>
          ) : coupon ? (
            <p className="text-sm text-white/60">Cupom inválido ou já aplicado.</p>
          ) : null}
        </div>

        {/* Frete */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Frete</h3>
          <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
            <div className="space-y-0.5">
              <p className="font-medium">PAC (5–8 dias)</p>
              <p className="text-sm text-white/70">Entrega econômica</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-emerald-400">{formatBRL(freightValue)}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm">
                {freightSelected}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Resumo */}
      <section className="rounded-2xl bg-[#0e1a16] border border-white/5 shadow-lg p-4 md:p-6 space-y-4">
        <h3 className="text-xl font-semibold">Resumo</h3>

        <div className="space-y-2 text-white/90">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Desconto {couponApplied ? '(10%)' : '(0%)'}</span>
            <span>-{formatBRL(discount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Frete • PAC (5–8 dias)</span>
            <span>{items.length ? formatBRL(freightValue) : formatBRL(0)}</span>
          </div>
          <hr className="border-white/10 my-2" />
          <div className="flex items-center justify-between text-xl font-semibold">
            <span>Total:</span>
            <span className="text-emerald-400">{formatBRL(grandTotal)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={finalizeOrder}
            className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-6 py-4 font-semibold transition"
          >
            Finalizar pedido
          </button>
          <a
            href="/"
            className="flex-1 text-center rounded-2xl border border-white/10 px-6 py-4 hover:bg-white/5 transition"
          >
            Voltar para a loja
          </a>
        </div>
      </section>
    </div>
  );
}
```0