// components/checkout/CheckoutClient.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

type Address = {
  name: string;
  phone: string;
  zip?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  complement?: string;
};

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CheckoutClient() {
  // ⚠️ NÃO pegamos mais "total" do contexto
  const { items, removeItem, clear } = useCart();

  // Calcula o total localmente
  const total = useMemo(
    () => items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 0), 0),
    [items]
  );

  const [addr, setAddr] = useState<Address>({ name: '', phone: '' });
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'JANE10') {
      setDiscountPercent(10);
    } else {
      setDiscountPercent(0);
    }
  };

  const discount = useMemo(
    () => Math.round((total * discountPercent) / 100),
    [total, discountPercent]
  );
  const finalTotal = useMemo(() => Math.max(total - discount, 0), [total, discount]);

  const handleFinish = () => {
    const lines: string[] = [];
    lines.push('*Novo pedido*');
    if (items.length === 0) lines.push('_Carrinho vazio_');
    items.forEach((it) => {
      lines.push(`• ${it.name} — ${fmtBRL(it.price)} x ${it.quantity}`);
    });
    if (discountPercent > 0) {
      lines.push(`Desconto: ${discountPercent}% (${fmtBRL(discount)})`);
    }
    lines.push(`*Total*: ${fmtBRL(finalTotal)}`);
    lines.push('');
    lines.push('*Dados para entrega*');
    if (addr.name) lines.push(`Nome: ${addr.name}`);
    if (addr.phone) lines.push(`Telefone: ${addr.phone}`);
    if (addr.zip) lines.push(`CEP: ${addr.zip}`);
    if (addr.street) lines.push(`Rua: ${addr.street}`);
    if (addr.number) lines.push(`Número: ${addr.number}`);
    if (addr.city) lines.push(`Cidade: ${addr.city}`);
    if (addr.state) lines.push(`Estado: ${addr.state}`);
    if (addr.complement) lines.push(`Complemento: ${addr.complement}`);

    const text = encodeURIComponent(lines.join('\n'));
    const phone = '5544988606483'; // seu número com DDI +55
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-8">
      {/* Carrinho */}
      <section className="rounded-2xl border border-white/10 bg-neutral-900/40 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Carrinho</h2>

        {items.length === 0 ? (
          <p className="text-sm text-white/70">Seu carrinho está vazio.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((it) => (
              <li
                key={String(it.id)}
                className="flex items-center justify-between gap-4 rounded-xl bg-neutral-800/40 p-3"
              >
                <div className="flex items-center gap-3">
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-neutral-700" />
                  )}
                  <div>
                    <p className="text-white font-medium">{it.name}</p>
                    <p className="text-white/70 text-sm">
                      {it.quantity} × {fmtBRL(it.price)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(it.id)}
                  className="rounded-full bg-rose-600/80 hover:bg-rose-600 text-white px-4 py-1.5 text-sm"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={clear}
            className="rounded-xl border border-white/15 bg-neutral-800/50 px-4 py-2 text-sm text-white hover:bg-neutral-700/50"
            disabled={items.length === 0}
          >
            Limpar carrinho
          </button>

          <Link
            href="/"
            className="rounded-xl border border-emerald-500/30 text-emerald-400 px-4 py-2 text-sm hover:bg-emerald-500/10"
          >
            Voltar para a loja
          </Link>
        </div>
      </section>

      {/* Endereço */}
      <section className="rounded-2xl border border-white/10 bg-neutral-900/40 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-2 text-white placeholder:text-white/40 outline-none border border-white/10"
            placeholder="Nome *"
            value={addr.name}
            onChange={(e) => setAddr((a) => ({ ...a, name: e.target.value }))}
          />
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-2 text-white placeholder:text-white/40 outline-none border border-white/10"
            placeholder="Telefone *"
            value={addr.phone}
            onChange={(e) => setAddr((a) => ({ ...a, phone: e.target.value }))}
          />

          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-2 text-white placeholder:text-white/40 outline-none border border-white/10"
            placeholder="CEP"
            value={addr.zip ?? ''}
            onChange={(e) => setAddr((a) => ({ ...a, zip: e.target.value }))}
          />
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-2 text-white placeholder:text-white/40 outline-none border border-white/10"
            placeholder="Rua"
            value={addr.street ?? ''}
            onChange={(e) => setAddr((a) => ({ ...a, street: e.target.value }))}
          />

          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-2 text-white placeholder:text-white/40 outline-none border border-white/10"
            placeholder="Número"
            value={addr.number ?? ''}
            onChange={(e) => setAddr((a) => ({ ...a, number: e.target.value }))}
          />
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-2 text-white placeholder:text-white/40 outline-none border border-white/10"
            placeholder="Cidade"
            value={addr.city ?? ''}
            onChange={(e) => setAddr((a) => ({ ...a, city: e.target.value }))}
          />

          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-2 text-white placeholder:text-white/40 outline-none border border-white/10"
            placeholder="Estado"
            value={addr.state ?? ''}
            onChange={(e) => setAddr((a) => ({ ...a, state: e.target.value }))}
          />
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-2 text-white placeholder:text-white/40 outline-none border border-white/10"
            placeholder="Complemento"
            value={addr.complement ?? ''}
            onChange={(e) => setAddr((a) => ({ ...a, complement: e.target.value }))}
          />
        </div>
      </section>

      {/* Cupom + Resumo (sem frete) */}
      <section className="rounded-2xl border border-white/10 bg-neutral-900/40 p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="flex-1 min-w-[220px] rounded-xl bg-neutral-800/60 px-4 py-2 text-white placeholder:text-white/40 outline-none border border-white/10"
            placeholder="Cupom de desconto"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            onClick={applyCoupon}
            className="rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white px-4 py-2 text-sm"
          >
            Aplicar
          </button>
        </div>

        <div className="rounded-xl bg-neutral-800/40 border border-white/10 p-4">
          <h3 className="text-white font-semibold mb-3">Resumo</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/80">
              <span>Subtotal</span>
              <span>{fmtBRL(total)}</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Desconto ({discountPercent}%)</span>
              <span>-{fmtBRL(discount)}</span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between text-lg font-semibold text-white">
              <span>Total</span>
              <span>{fmtBRL(finalTotal)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleFinish}
            disabled={items.length === 0}
            className="rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white px-5 py-3 font-medium disabled:opacity-40"
          >
            Finalizar pedido
          </button>

          <Link
            href="/"
            className="rounded-xl border border-white/15 px-5 py-3 text-white/90 hover:bg-white/5"
          >
            Voltar para a loja
          </Link>
        </div>
      </section>
    </div>
  );
}