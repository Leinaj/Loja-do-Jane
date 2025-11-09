'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';

type Address = {
  name: string;
  phone: string;
  cep?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  complemento?: string;
};

const currencyBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CheckoutClient() {
  // ⬇️ ATENÇÃO: agora desestrutura `remove` (não `removeItem`)
  const { items, remove, setQty, clear, subtotal } = useCart();

  const [addr, setAddr] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
    complemento: '',
  });

  const total = useMemo(() => subtotal, [subtotal]);

  function updateField<K extends keyof Address>(key: K, value: Address[K]) {
    setAddr((prev) => ({ ...prev, [key]: value }));
  }

  function finalizeOrder() {
    const resumoItens =
      items.length === 0
        ? 'Carrinho vazio'
        : items
            .map(
              (it) =>
                `${it.quantity} × ${it.name} (${currencyBRL(it.price * it.quantity)})`
            )
            .join('\n');

    const resumoEndereco = `
Nome: ${addr.name || '-'}
Telefone: ${addr.phone || '-'}
CEP: ${addr.cep || '-'}
Rua: ${addr.street || '-'}, Nº ${addr.number || '-'}
Cidade: ${addr.city || '-'} - ${addr.state || '-'}
Comp.: ${addr.complemento || '-'}`.trim();

    // Apenas mostra uma mensagem com o resumo (sem integração de frete/pagamento)
    alert(
      `Resumo do pedido:\n\n${resumoItens}\n\nTotal: ${currencyBRL(
        total
      )}\n\nEndereço:\n${resumoEndereco}`
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Carrinho</h1>
        <Link
          href="/"
          className="rounded-xl border border-emerald-800/40 px-4 py-2 text-emerald-300 hover:bg-emerald-900/20"
        >
          Voltar para a loja
        </Link>
      </div>

      {/* Lista de itens */}
      <div className="rounded-3xl bg-neutral-900/60 p-4 sm:p-6 space-y-4">
        {items.length === 0 && (
          <p className="text-neutral-400">Seu carrinho está vazio.</p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-neutral-800/60 p-4 sm:p-5 grid grid-cols-[72px_1fr_auto] sm:grid-cols-[88px_1fr_auto] gap-4 items-center"
          >
            <div className="overflow-hidden rounded-xl bg-neutral-700/50">
              {item.image ? (
                <Image
                  src={item.image}
                  width={88}
                  height={88}
                  alt={item.name}
                  className="h-18 w-18 object-cover"
                />
              ) : (
                <div className="h-[72px] w-[72px] sm:h-[88px] sm:w-[88px]" />
              )}
            </div>

            <div className="space-y-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-neutral-400">{currencyBRL(item.price)}</div>

              {/* Controles de quantidade */}
              <div className="mt-2 flex items-center gap-3">
                <button
                  aria-label="Diminuir"
                  onClick={() => setQty(item.id, Math.max(1, item.quantity - 1))}
                  className="h-9 w-9 rounded-xl bg-neutral-700 text-lg"
                >
                  –
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  aria-label="Aumentar"
                  onClick={() => setQty(item.id, item.quantity + 1)}
                  className="h-9 w-9 rounded-xl bg-neutral-700 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-emerald-300 font-semibold">
                {currencyBRL(item.price * item.quantity)}
              </div>
              <button
                onClick={() => remove(item.id)} // ⬅️ usa remove()
                className="rounded-xl bg-rose-900/60 px-3 py-1.5 text-sm hover:bg-rose-900"
              >
                Remover
              </button>
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-lg font-semibold">
              Total: <span className="text-emerald-300">{currencyBRL(total)}</span>
            </div>
            <button
              onClick={() => clear()}
              className="rounded-xl bg-neutral-700/70 px-4 py-2 hover:bg-neutral-700"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>

      {/* Endereço (sem cálculo de frete) */}
      <div className="rounded-3xl bg-neutral-900/60 p-4 sm:p-6 space-y-4">
        <h2 className="text-xl font-semibold">Endereço</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-3 outline-none"
            placeholder="Nome *"
            value={addr.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-3 outline-none"
            placeholder="Telefone *"
            value={addr.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />

          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-3 outline-none"
            placeholder="CEP"
            value={addr.cep}
            onChange={(e) => updateField('cep', e.target.value)}
          />
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-3 outline-none"
            placeholder="Rua"
            value={addr.street}
            onChange={(e) => updateField('street', e.target.value)}
          />

          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-3 outline-none"
            placeholder="Número"
            value={addr.number}
            onChange={(e) => updateField('number', e.target.value)}
          />
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-3 outline-none"
            placeholder="Cidade"
            value={addr.city}
            onChange={(e) => updateField('city', e.target.value)}
          />

          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-3 outline-none"
            placeholder="Estado"
            value={addr.state}
            onChange={(e) => updateField('state', e.target.value)}
          />
          <input
            className="rounded-xl bg-neutral-800/60 px-4 py-3 outline-none"
            placeholder="Complemento"
            value={addr.complemento}
            onChange={(e) => updateField('complemento', e.target.value)}
          />
        </div>
      </div>

      {/* Ações finais */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Link
          href="/"
          className="rounded-2xl border border-emerald-800/40 px-5 py-3 text-center text-emerald-300 hover:bg-emerald-900/20"
        >
          Voltar para a loja
        </Link>

        <button
          disabled={items.length === 0}
          onClick={finalizeOrder}
          className="rounded-2xl bg-emerald-600 px-6 py-3 font-medium text-black enabled:hover:bg-emerald-500 disabled:opacity-50"
        >
          Finalizar pedido
        </button>
      </div>
    </div>
  );
}