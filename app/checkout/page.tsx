'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../../lib/cart';

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

export default function CheckoutPage() {
  const { items, remove, clear, total } = useCart();

  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
    complement: '',
  });

  // Busca endereço via ViaCEP ao digitar CEP (somente números)
  useEffect(() => {
    const cep = (address.cep || '').replace(/\D/g, '');
    if (cep.length !== 8) return;

    const ctrl = new AbortController();
    fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data) => {
        if (!data?.erro) {
          setAddress((a) => ({
            ...a,
            street: data.logradouro || a.street,
            city: data.localidade || a.city,
            state: data.uf || a.state,
          }));
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [address.cep]);

  const canFinish = useMemo(() => {
    if (!items.length) return false;
    const { name, phone, cep, street, number, city, state } = address;
    return [name, phone, cep, street, number, city, state].every(Boolean);
  }, [items.length, address]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Carrinho */}
      <section className="rounded-xl border border-white/10 bg-black/20 p-4">
        <h2 className="mb-4 text-xl font-semibold">Carrinho</h2>

        {!items.length && <p className="text-white/70">Carrinho vazio.</p>}

        <ul className="space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between gap-4 rounded-lg bg-white/5 p-3"
            >
              <div className="flex items-center gap-3">
                {it.image && (
                  <Image
                    src={it.image}
                    alt={it.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded object-cover"
                  />
                )}
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-white/70">
                    {it.quantity} × R$ {it.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => remove(it.id)}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium hover:bg-rose-500"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg">
            <span className="text-white/70">Total</span>{' '}
            <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
          </div>

          <button
            onClick={clear}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
          >
            Limpar carrinho
          </button>
        </div>
      </section>

      {/* Endereço */}
      <section className="rounded-xl border border-white/10 bg-black/20 p-4">
        <h2 className="mb-4 text-xl font-semibold">Endereço</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-lg bg-white/5 p-3 outline-none"
            placeholder="Nome *"
            value={address.name}
            onChange={(e) => setAddress({ ...address, name: e.target.value })}
          />
          <input
            className="rounded-lg bg-white/5 p-3 outline-none"
            placeholder="Telefone *"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          />
          <input
            className="rounded-lg bg-white/5 p-3 outline-none"
            placeholder="CEP *"
            inputMode="numeric"
            value={address.cep}
            onChange={(e) =>
              setAddress({ ...address, cep: e.target.value.replace(/\D/g, '') })
            }
          />
          <input
            className="rounded-lg bg-white/5 p-3 outline-none"
            placeholder="Rua *"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            className="rounded-lg bg-white/5 p-3 outline-none"
            placeholder="Número *"
            value={address.number}
            onChange={(e) => setAddress({ ...address, number: e.target.value })}
          />
          <input
            className="rounded-lg bg-white/5 p-3 outline-none"
            placeholder="Cidade *"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            className="rounded-lg bg-white/5 p-3 outline-none"
            placeholder="Estado *"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
          <input
            className="rounded-lg bg-white/5 p-3 outline-none md:col-span-2"
            placeholder="Complemento"
            value={address.complement || ''}
            onChange={(e) =>
              setAddress({ ...address, complement: e.target.value })
            }
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            disabled={!canFinish}
            className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:bg-emerald-500"
            onClick={() => alert('Pedido finalizado! (fluxo de pagamento em breve)')}
          >
            Finalizar pedido
          </button>

          <a
            href="/"
            className="rounded-lg border border-white/20 px-5 py-3 font-medium hover:bg-white/5"
          >
            Voltar para a loja
          </a>
        </div>
      </section>
    </main>
  );
}