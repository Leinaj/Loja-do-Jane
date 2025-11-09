'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';

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
  // ✅ aqui já está usando `remove` (no lugar de removeItem)
  const { items, remove, setQty, clear, subtotal } = useCart();

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
  const [discountPercent, setDiscountPercent] = useState(0);

  // CEP -> auto-preencher via ViaCEP
  useEffect(() => {
    const cep = addr.cep?.replace(/\D/g, '');
    if (cep?.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.erro) return;
          setAddr((a) => ({
            ...a,
            street: data.logradouro || a.street,
            city: data.localidade || a.city,
            state: data.uf || a.state,
          }));
        })
        .catch(() => {});
    }
  }, [addr.cep]);

  const total = Math.max(0, subtotal * (1 - discountPercent / 100));

  function applyCoupon() {
    setDiscountPercent(coupon.trim().toUpperCase() === 'JANE10' ? 10 : 0);
  }

  function finalize() {
    const msg = [
      'Novo pedido',
      '',
      'Itens:',
      ...items.map(
        (i) => `• ${i.title} — ${i.qty} x R$ ${i.price.toFixed(2)}`
      ),
      '',
      `Subtotal: R$ ${subtotal.toFixed(2)}`,
      `Desconto (${discountPercent}%): R$ ${(subtotal - total).toFixed(2)}`,
      `Total: R$ ${total.toFixed(2)}`,
      '',
      'Dados do cliente:',
      `Nome: ${addr.name}`,
      `Telefone: ${addr.phone}`,
      `CEP: ${addr.cep}`,
      `Endereço: ${addr.street}, ${addr.number} - ${addr.city}/${addr.state}`,
      addr.complement ? `Complemento: ${addr.complement}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    // Por enquanto só mostra em alerta. Troque por envio (WhatsApp/Email) se quiser.
    alert(msg);
  }

  if (!items.length) {
    return <div className="p-6">Seu carrinho está vazio.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Carrinho */}
      <section className="rounded-2xl p-4 bg-black/30">
        <h2 className="text-xl font-semibold mb-3">Carrinho</h2>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-black/20 p-3"
            >
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm opacity-70">
                  R$ {item.price.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="w-9 h-9 rounded-lg bg-black/30"
                  onClick={() => setQty(item.id, Math.max(1, item.qty - 1))}
                >
                  −
                </button>
                <div className="w-8 text-center">{item.qty}</div>
                <button
                  className="w-9 h-9 rounded-lg bg-black/30"
                  onClick={() => setQty(item.id, item.qty + 1)}
                >
                  +
                </button>
              </div>

              <div className="w-28 text-right">
                R$ {(item.price * item.qty).toFixed(2)}
              </div>

              <button
                className="ml-3 rounded-xl bg-rose-900/60 px-3 py-2"
                onClick={() => remove(item.id)} // ✅ usando remove()
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Subtotal</div>
          <div className="text-lg font-semibold">
            R$ {subtotal.toFixed(2)}
          </div>
        </div>

        <div className="mt-3">
          <button className="rounded-xl bg-black/40 px-4 py-2" onClick={clear}>
            Limpar carrinho
          </button>
        </div>
      </section>

      {/* Endereço */}
      <section className="rounded-2xl p-4 bg-black/30">
        <h2 className="text-xl font-semibold mb-3">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="rounded-xl p-3 bg-black/20"
            placeholder="Nome *"
            value={addr.name}
            onChange={(e) => setAddr((a) => ({ ...a, name: e.target.value }))}
          />
          <input
            className="rounded-xl p-3 bg-black/20"
            placeholder="Telefone *"
            value={addr.phone}
            onChange={(e) => setAddr((a) => ({ ...a, phone: e.target.value }))}
          />
          <input
            className="rounded-xl p-3 bg-black/20"
            placeholder="CEP *"
            value={addr.cep}
            onChange={(e) => setAddr((a) => ({ ...a, cep: e.target.value }))}
          />
          <input
            className="rounded-xl p-3 bg-black/20"
            placeholder="Rua *"
            value={addr.street}
            onChange={(e) => setAddr((a) => ({ ...a, street: e.target.value }))}
          />
          <input
            className="rounded-xl p-3 bg-black/20"
            placeholder="Número *"
            value={addr.number}
            onChange={(e) =>
              setAddr((a) => ({ ...a, number: e.target.value }))
            }
          />
          <input
            className="rounded-xl p-3 bg-black/20"
            placeholder="Cidade *"
            value={addr.city}
            onChange={(e) => setAddr((a) => ({ ...a, city: e.target.value }))}
          />
          <input
            className="rounded-xl p-3 bg-black/20"
            placeholder="Estado *"
            value={addr.state}
            onChange={(e) => setAddr((a) => ({ ...a, state: e.target.value }))}
          />
          <input
            className="rounded-xl p-3 bg-black/20 md:col-span-2"
            placeholder="Complemento"
            value={addr.complement}
            onChange={(e) =>
              setAddr((a) => ({ ...a, complement: e.target.value }))
            }
          />
        </div>
      </section>

      {/* Cupom + Total */}
      <section className="rounded-2xl p-4 bg-black/30">
        <h2 className="text-xl font-semibold mb-3">Cupom de desconto</h2>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl p-3 bg-black/20"
            placeholder="Ex.: JANE10"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            className="rounded-xl px-4 py-2 bg-emerald-700/70"
            onClick={applyCoupon}
          >
            Aplicar
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-black/20 p-3 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Desconto ({discountPercent}%)</span>
            <span>- R$ {(subtotal - total).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            className="rounded-xl bg-emerald-700/80 px-4 py-3"
            onClick={finalize}
          >
            Finalizar pedido
          </button>
          <button
            className="rounded-xl bg-black/40 px-4 py-3"
            onClick={() => history.back()}
          >
            Voltar para a loja
          </button>
        </div>
      </section>
    </div>
  );
}