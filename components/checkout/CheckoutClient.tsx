// components/checkout/CheckoutClient.tsx
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

const OWNER_WHATS = '5544988606483'; // destino

export default function CheckoutClient() {
  const { items, removeItem, clear, total } = useCart(); // total/subtotal vindo do contexto
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
  const [coupon, setCoupon] = useState('');

  const subtotal = useMemo(() => total(), [total]); // sem frete

  const message = useMemo(() => {
    const lines = [
      '*Novo pedido — Loja da Jane*',
      '',
      '*Itens:*',
      ...items.map(
        (it) => `• ${it.quantity} × ${it.name} — R$ ${(it.price / 100).toFixed(2)}`
      ),
      '',
      `*Subtotal:* R$ ${(subtotal / 100).toFixed(2)}`,
      coupon ? `*Cupom:* ${coupon}` : '',
      '',
      '*Dados do cliente:*',
      `Nome: ${addr.name || '-'}`,
      `Telefone: ${addr.phone || '-'}`,
      `CEP: ${addr.cep || '-'}`,
      `Rua: ${addr.street || '-'}  Nº: ${addr.number || '-'}`,
      `Cidade: ${addr.city || '-'}  UF: ${addr.state || '-'}`,
      `Complemento: ${addr.complement || '-'}`,
    ].filter(Boolean);

    return encodeURIComponent(lines.join('\n'));
  }, [items, subtotal, addr, coupon]);

  const waLink = `https://wa.me/${OWNER_WHATS}?text=${message}`;

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4">Carrinho</h2>
        <p className="opacity-80 mb-6">Seu carrinho está vazio.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-6 rounded-xl border border-white/10 text-white/90 hover:bg-white/5"
        >
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Carrinho</h2>

      {/* Lista de itens */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-8">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0"
          >
            <div className="flex items-center gap-3">
              {it.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt={it.name} className="w-12 h-12 rounded-lg object-cover" />
              )}
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm opacity-80">
                  {it.quantity} × R$ {(it.price / 100).toFixed(2)}
                </div>
              </div>
            </div>
            <button
              onClick={() => removeItem(it.id)}
              className="h-10 px-4 rounded-xl bg-rose-900/40 text-rose-200 hover:bg-rose-900/60"
            >
              Remover
            </button>
          </div>
        ))}

        <div className="flex items-center justify-between mt-4">
          <div className="text-lg">
            Total: <span className="font-semibold text-emerald-400">R$ {(subtotal / 100).toFixed(2)}</span>
          </div>
          <button
            onClick={clear}
            className="h-10 px-4 rounded-xl border border-white/10 hover:bg-white/5"
          >
            Limpar carrinho
          </button>
        </div>
      </div>

      {/* Dados / Cupom */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <h3 className="font-semibold mb-4">Endereço</h3>

          <label className="block text-sm opacity-80 mb-1">Nome *</label>
          <input className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-3 h-11"
            value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} />

          <label className="block text-sm opacity-80 mb-1">Telefone *</label>
          <input className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-3 h-11"
            value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />

          <label className="block text-sm opacity-80 mb-1">CEP</label>
          <input className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-3 h-11"
            value={addr.cep} onChange={(e) => setAddr({ ...addr, cep: e.target.value })} />

          <label className="block text-sm opacity-80 mb-1">Rua</label>
          <input className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-3 h-11"
            value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm opacity-80 mb-1">Número</label>
              <input className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-3 h-11"
                value={addr.number} onChange={(e) => setAddr({ ...addr, number: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm opacity-80 mb-1">Complemento</label>
              <input className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-3 h-11"
                value={addr.complement} onChange={(e) => setAddr({ ...addr, complement: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm opacity-80 mb-1">Cidade</label>
              <input className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-3 h-11"
                value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm opacity-80 mb-1">Estado</label>
              <input className="w-full mb-3 rounded-xl bg-white/5 border border-white/10 px-3 h-11"
                value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <h3 className="font-semibold mb-4">Resumo</h3>

          <label className="block text-sm opacity-80 mb-1">Cupom de desconto</label>
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 h-11"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="JANE10"
            />
            <button className="h-11 px-4 rounded-xl bg-emerald-600/80 hover:bg-emerald-600">
              Aplicar
            </button>
          </div>

          <div className="space-y-2 text-sm opacity-90 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>R$ {(subtotal / 100).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Desconto (0%)</span><span>-R$ 0,00</span></div>
            {/* Frete removido */}
          </div>

          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total:</span>
            <span className="text-emerald-400">R$ {(subtotal / 100).toFixed(2)}</span>
          </div>

          {/* Finalizar pedido → WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
          >
            Finalizar pedido
          </a>

          <Link
            href="/"
            className="mt-3 w-full inline-flex items-center justify-center h-12 rounded-xl border border-white/10 text-white/90 hover:bg-white/5"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}