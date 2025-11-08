// app/pagamento/page.tsx
'use client';

import { useEffect, useState } from 'react';

type Order = {
  items: { id: string; name: string; price: number; quantity: number }[];
  address: {
    name: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    city: string;
    state: string;
  };
  total: number;
  createdAt: string;
};

export default function PagamentoPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [method, setMethod] = useState<'pix' | 'card' | 'boleto' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('last_order_v1');
    if (saved) setOrder(JSON.parse(saved));
  }, []);

  if (!order) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-white/70">Nenhum pedido encontrado.</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Pagamento</h1>

      <section className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 space-y-2">
        <div className="font-medium">Resumo</div>
        <ul className="text-sm text-white/80 list-disc pl-5">
          {order.items.map((i) => (
            <li key={i.id}>
              {i.quantity} × {i.name} — R${' '}
              {(i.price * i.quantity).toFixed(2).replace('.', ',')}
            </li>
          ))}
        </ul>
        <div className="flex justify-between pt-3 border-t border-white/10">
          <span>Total</span>
          <span className="font-bold">
            R$ {order.total.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 space-y-3">
        <div className="font-medium">Escolha a forma de pagamento</div>

        <div className="grid sm:grid-cols-3 gap-3">
          <button
            onClick={() => setMethod('pix')}
            className={`px-4 py-3 rounded-lg border ${
              method === 'pix'
                ? 'border-emerald-500 bg-emerald-600/20'
                : 'border-white/10 bg-neutral-800'
            }`}
          >
            Pix
          </button>
          <button
            onClick={() => setMethod('card')}
            className={`px-4 py-3 rounded-lg border ${
              method === 'card'
                ? 'border-emerald-500 bg-emerald-600/20'
                : 'border-white/10 bg-neutral-800'
            }`}
          >
            Cartão
          </button>
          <button
            onClick={() => setMethod('boleto')}
            className={`px-4 py-3 rounded-lg border ${
              method === 'boleto'
                ? 'border-emerald-500 bg-emerald-600/20'
                : 'border-white/10 bg-neutral-800'
            }`}
          >
            Boleto
          </button>
        </div>

        {method && (
          <div className="rounded-lg bg-neutral-800 p-4 text-sm text-white/80">
            {method === 'pix' && (
              <p>
                (Demo) Gerando QR Code do Pix… Aqui você integraria com o seu
                PSP/gateway para criar o pagamento Pix.
              </p>
            )}
            {method === 'card' && (
              <p>
                (Demo) Formulário de cartão… Aqui entra a integração com
                Stripe/Mercado Pago/Pagar.me.
              </p>
            )}
            {method === 'boleto' && (
              <p>
                (Demo) Emitindo boleto… Aqui você chamaria a API do gateway para
                gerar o PDF/código de barras.
              </p>
            )}
          </div>
        )}

        <button
          disabled={!method}
          className="mt-2 px-5 py-3 rounded-lg bg-emerald-600 disabled:opacity-60"
          onClick={() => alert('Pedido confirmado (demo)!')}
        >
          Confirmar pagamento
        </button>
      </section>
    </main>
  );
}