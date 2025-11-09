'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

type Address = {
  name: string;
  phone: string;
  cep?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  complement?: string;
};

const fmtBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CheckoutClient() {
  // <- AQUI: nada de removeItem e nada de subtotal/total no contexto
  const { items, remove, setQty, clear } = useCart();

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

  // subtotal calculado localmente
  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.quantity, 0),
    [items]
  );

  const onQtyDec = (id: string, current: number) =>
    setQty(id, Math.max(1, current - 1));
  const onQtyInc = (id: string, current: number) => setQty(id, current + 1);

  const handleFinishOrder = () => {
    const phone = '5544988606483';
    const itensTxt =
      items.length === 0
        ? 'Sem itens'
        : items
            .map(
              (i) =>
                `• ${i.quantity}x ${i.name} — ${fmtBRL(i.price)} = ${fmtBRL(
                  i.price * i.quantity
                )}`
            )
            .join('%0A');

    const enderecoTxt = [
      addr.name && `Nome: ${addr.name}`,
      addr.phone && `Telefone: ${addr.phone}`,
      addr.cep && `CEP: ${addr.cep}`,
      (addr.street || addr.number) &&
        `Endereço: ${addr.street ?? ''}, ${addr.number ?? ''}`,
      (addr.city || addr.state) && `Cidade/UF: ${addr.city ?? ''} - ${addr.state ?? ''}`,
      addr.complement && `Complemento: ${addr.complement}`,
    ]
      .filter(Boolean)
      .join('%0A');

    const msg =
      `*Novo pedido*%0A%0A` +
      `*Itens:*%0A${itensTxt}%0A%0A` +
      `*Subtotal:* ${fmtBRL(subtotal)}%0A%0A` +
      `*Dados para entrega*%0A${enderecoTxt || '—'}`;

    const url = `https://wa.me/${phone}?text=${msg}`;
    window.open(url, '_blank');
  };

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 space-y-6">
      <section className="rounded-2xl bg-zinc-900/50 p-4 sm:p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Carrinho</h2>

        {items.length === 0 ? (
          <p className="text-zinc-400">Seu carrinho está vazio.</p>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-zinc-800/60 p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{it.name}</p>
                  <p className="text-zinc-400 text-sm">{fmtBRL(it.price)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    aria-label="Diminuir"
                    onClick={() => onQtyDec(it.id, it.quantity)}
                    className="h-9 w-9 rounded-lg bg-zinc-700 hover:bg-zinc-600"
                  >
                    –
                  </button>
                  <span className="w-6 text-center">{it.quantity}</span>
                  <button
                    aria-label="Aumentar"
                    onClick={() => onQtyInc(it.id, it.quantity)}
                    className="h-9 w-9 rounded-lg bg-zinc-700 hover:bg-zinc-600"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{fmtBRL(it.price * it.quantity)}</p>
                </div>

                <button
                  onClick={() => remove(it.id)}
                  className="rounded-xl bg-rose-700/80 hover:bg-rose-600 px-3 py-2 text-sm"
                >
                  Remover
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <p className="text-lg">
                <span className="text-zinc-400">Total: </span>
                <span className="font-semibold">{fmtBRL(subtotal)}</span>
              </p>
              <button
                onClick={clear}
                className="rounded-xl border border-zinc-700 px-4 py-2 hover:bg-zinc-800"
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Endereço (sem frete) */}
      <section className="rounded-2xl bg-zinc-900/50 p-4 sm:p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Endereço</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="rounded-xl bg-zinc-800/60 px-3 py-2 outline-none"
            placeholder="Nome *"
            value={addr.name}
            onChange={(e) => setAddr((s) => ({ ...s, name: e.target.value }))}
          />
          <input
            className="rounded-xl bg-zinc-800/60 px-3 py-2 outline-none"
            placeholder="Telefone *"
            value={addr.phone}
            onChange={(e) => setAddr((s) => ({ ...s, phone: e.target.value }))}
          />
          <input
            className="rounded-xl bg-zinc-800/60 px-3 py-2 outline-none"
            placeholder="CEP"
            value={addr.cep}
            onChange={(e) => setAddr((s) => ({ ...s, cep: e.target.value }))}
          />
          <input
            className="rounded-xl bg-zinc-800/60 px-3 py-2 outline-none"
            placeholder="Rua"
            value={addr.street}
            onChange={(e) => setAddr((s) => ({ ...s, street: e.target.value }))}
          />
          <input
            className="rounded-xl bg-zinc-800/60 px-3 py-2 outline-none"
            placeholder="Número"
            value={addr.number}
            onChange={(e) => setAddr((s) => ({ ...s, number: e.target.value }))}
          />
          <input
            className="rounded-xl bg-zinc-800/60 px-3 py-2 outline-none"
            placeholder="Cidade"
            value={addr.city}
            onChange={(e) => setAddr((s) => ({ ...s, city: e.target.value }))}
          />
          <input
            className="rounded-xl bg-zinc-800/60 px-3 py-2 outline-none"
            placeholder="Estado"
            value={addr.state}
            onChange={(e) => setAddr((s) => ({ ...s, state: e.target.value }))}
          />
          <input
            className="rounded-xl bg-zinc-800/60 px-3 py-2 outline-none sm:col-span-2"
            placeholder="Complemento"
            value={addr.complement}
            onChange={(e) =>
              setAddr((s) => ({ ...s, complement: e.target.value }))
            }
          />
        </div>
      </section>

      <section className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleFinishOrder}
          disabled={items.length === 0}
          className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 font-semibold disabled:opacity-60"
        >
          Finalizar pedido (WhatsApp)
        </button>

        <Link
          href="/"
          className="flex-1 rounded-2xl border border-zinc-700 px-6 py-3 text-center hover:bg-zinc-800"
        >
          Voltar para a loja
        </Link>
      </section>
    </div>
  );
}