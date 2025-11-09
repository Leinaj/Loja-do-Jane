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

const BRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CheckoutClient() {
  const { items, removeItem, setQty, clear, subtotal } = useCart();

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

  const total = useMemo(() => subtotal, [subtotal]); // sem frete/sem cupom

  const handleSendWhatsApp = () => {
    const linhasItens =
      items.length === 0
        ? '- (carrinho vazio)'
        : items
            .map(
              (it) =>
                `• ${it.name} x${it.quantity} — ${BRL(it.price * it.quantity)}`
            )
            .join('%0A');

    const endereco = [
      addr.name && `Nome: ${addr.name}`,
      addr.phone && `Telefone: ${addr.phone}`,
      addr.cep && `CEP: ${addr.cep}`,
      addr.street && `Rua: ${addr.street}`,
      addr.number && `Número: ${addr.number}`,
      addr.city && `Cidade: ${addr.city}`,
      addr.state && `Estado: ${addr.state}`,
      addr.complement && `Compl.: ${addr.complement}`,
    ]
      .filter(Boolean)
      .join('%0A');

    const texto = [
      'Novo pedido via Loja da Jane 🛍️',
      '',
      'Itens:',
      linhasItens,
      '',
      `Total: ${BRL(total)}`,
      '',
      'Endereço:',
      endereco || '- não informado -',
    ]
      .filter(Boolean)
      .join('%0A');

    // WhatsApp: 55 + DDD + número
    const url = `https://wa.me/5544988606483?text=${texto}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Carrinho */}
      <section className="rounded-3xl bg-neutral-900 p-6">
        <h2 className="text-2xl font-semibold mb-4">Carrinho</h2>

        {items.length === 0 ? (
          <div className="text-neutral-400">Seu carrinho está vazio.</div>
        ) : (
          <ul className="space-y-4">
            {items.map((it) => (
              <li
                key={String(it.id)}
                className="flex items-center gap-4 rounded-2xl bg-neutral-800 p-4"
              >
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-neutral-700" />
                )}

                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-neutral-400">
                    {BRL(it.price)} • Qtd:
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="h-9 w-9 rounded-lg bg-neutral-700"
                    onClick={() => setQty(it.id, Math.max(1, it.quantity - 1))}
                    aria-label="Diminuir"
                  >
                    –
                  </button>
                  <div className="min-w-10 text-center">{it.quantity}</div>
                  <button
                    className="h-9 w-9 rounded-lg bg-neutral-700"
                    onClick={() => setQty(it.id, it.quantity + 1)}
                    aria-label="Aumentar"
                  >
                    +
                  </button>
                </div>

                <div className="w-28 text-right font-medium">
                  {BRL(it.price * it.quantity)}
                </div>

                <button
                  className="ml-2 rounded-xl bg-rose-800/60 px-4 py-2"
                  onClick={() => removeItem(it.id)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl">
            <span className="text-neutral-400 mr-2">Total:</span>
            <span className="font-semibold">{BRL(total)}</span>
          </div>

          <button
            className="rounded-xl bg-neutral-800 px-4 py-2"
            onClick={clear}
            disabled={items.length === 0}
          >
            Limpar carrinho
          </button>
        </div>
      </section>

      {/* Endereço (campos simples) */}
      <section className="rounded-3xl bg-neutral-900 p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Nome *"
            className="h-12 rounded-xl bg-neutral-800 px-4"
            value={addr.name}
            onChange={(e) => setAddr({ ...addr, name: e.target.value })}
          />
          <input
            placeholder="Telefone *"
            className="h-12 rounded-xl bg-neutral-800 px-4"
            value={addr.phone}
            onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
          />
          <input
            placeholder="CEP"
            className="h-12 rounded-xl bg-neutral-800 px-4"
            value={addr.cep}
            onChange={(e) => setAddr({ ...addr, cep: e.target.value })}
          />
          <input
            placeholder="Rua"
            className="h-12 rounded-xl bg-neutral-800 px-4"
            value={addr.street}
            onChange={(e) => setAddr({ ...addr, street: e.target.value })}
          />
          <input
            placeholder="Número"
            className="h-12 rounded-xl bg-neutral-800 px-4"
            value={addr.number}
            onChange={(e) => setAddr({ ...addr, number: e.target.value })}
          />
          <input
            placeholder="Cidade"
            className="h-12 rounded-xl bg-neutral-800 px-4"
            value={addr.city}
            onChange={(e) => setAddr({ ...addr, city: e.target.value })}
          />
          <input
            placeholder="Estado"
            className="h-12 rounded-xl bg-neutral-800 px-4"
            value={addr.state}
            onChange={(e) => setAddr({ ...addr, state: e.target.value })}
          />
          <input
            placeholder="Complemento"
            className="h-12 rounded-xl bg-neutral-800 px-4 md:col-span-2"
            value={addr.complement}
            onChange={(e) => setAddr({ ...addr, complement: e.target.value })}
          />
        </div>
      </section>

      {/* Ações */}
      <section className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleSendWhatsApp}
          disabled={items.length === 0}
          className="h-12 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition font-medium"
        >
          Finalizar pedido
        </button>

        <Link
          href="/"
          className="h-12 flex-1 grid place-items-center rounded-xl border border-emerald-700/40"
        >
          Voltar para a loja
        </Link>
      </section>
    </div>
  );
}