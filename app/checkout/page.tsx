// app/checkout/page.tsx
'use client';

import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Endereco = {
  nome: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
};

export default function CheckoutPage() {
  const { items, remove, clear, total } = useCart();
  const router = useRouter();

  const [endereco, setEndereco] = useState<Endereco>({
    nome: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
  });

  const cartTotal = useMemo(() => total, [total]);

  const finalizar = () => {
    if (
      !endereco.nome ||
      !endereco.telefone ||
      !endereco.cep ||
      !endereco.rua ||
      !endereco.numero ||
      !endereco.cidade ||
      !endereco.estado
    ) {
      alert('Preencha todos os campos do endereço.');
      return;
    }

    const pedido = {
      items,
      address: {
        name: endereco.nome,
        phone: endereco.telefone,
        cep: endereco.cep,
        street: endereco.rua,
        number: endereco.numero,
        city: endereco.cidade,
        state: endereco.estado,
      },
      total: cartTotal,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('last_order_v1', JSON.stringify(pedido));
    router.push('/pagamento');
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-4xl font-bold">Checkout</h1>

      <section className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
        <h2 className="text-xl font-semibold mb-3">Carrinho</h2>

        {items.length === 0 ? (
          <p className="text-white/70">Carrinho vazio.</p>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-neutral-900 p-3 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  {/* MINIATURA */}
                  <div className="relative h-12 w-12 rounded-md overflow-hidden">
                    <Image
                      src={it.image || '/placeholder.png'}
                      alt={it.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-white/60">
                      {it.quantity} × R$ {it.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => remove(it.id)}
                  className="px-3 py-2 rounded-md bg-rose-600 hover:bg-rose-500 transition"
                >
                  Remover
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-lg">Total</span>
              <span className="text-xl font-bold">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clear}
                className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition"
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-neutral-900/50 p-4 space-y-3">
        <h2 className="text-xl font-semibold mb-1">Endereço</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              ['nome', 'Nome *'],
              ['telefone', 'Telefone *'],
              ['cep', 'CEP *'],
              ['rua', 'Rua *'],
              ['numero', 'Número *'],
              ['cidade', 'Cidade *'],
              ['estado', 'Estado *'],
            ] as const
          ).map(([key, label]) => (
            <input
              key={key}
              placeholder={label}
              value={endereco[key]}
              onChange={(e) =>
                setEndereco((a) => ({ ...a, [key]: e.target.value }))
              }
              className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={finalizar}
          className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition font-medium"
          disabled={items.length === 0}
        >
          Finalizar pedido
        </button>
      </div>
    </main>
  );
}