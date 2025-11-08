'use client';

import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { useMemo, useState } from 'react';

type Address = {
  nome: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  complemento?: string;
  bairro?: string;
};

export default function CheckoutPage() {
  const { items, remove, clear } = useCart();

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.price * (it.quantity ?? 1), 0),
    [items]
  );

  const [address, setAddress] = useState<Address>({
    nome: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
    complemento: '',
    bairro: '',
  });

  // Busca ViaCEP quando CEP tem 8 dígitos
  const handleCepChange = async (value: string) => {
    const onlyDigits = value.replace(/\D/g, '');
    setAddress((a) => ({ ...a, cep: value }));

    if (onlyDigits.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${onlyDigits}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress((a) => ({
            ...a,
            rua: data.logradouro ?? a.rua,
            bairro: data.bairro ?? a.bairro,
            cidade: data.localidade ?? a.cidade,
            estado: data.uf ?? a.estado,
          }));
        }
      } catch {
        // silencioso
      }
    }
  };

  const onChange =
    (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddress((a) => ({ ...a, [key]: e.target.value }));

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-3xl font-semibold">Checkout</h1>

      {/* Carrinho */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
        <h2 className="mb-3 text-lg font-medium">Carrinho</h2>

        {items.length === 0 ? (
          <p className="text-white/70">Carrinho vazio.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-neutral-900/60 p-3"
              >
                <div className="flex items-center gap-3">
                  {/* miniatura */}
                  {it.image ? (
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-neutral-800">
                      <Image
                        src={it.image}
                        alt={it.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-neutral-800" />
                  )}

                  <div>
                    <div className="text-sm font-medium">{it.name}</div>
                    <div className="text-xs text-white/60">
                      {it.quantity ?? 1} × R${' '}
                      {it.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => remove(String(it.id))}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-500"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={clear}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Limpar carrinho
          </button>
          <div className="text-right text-lg">
            Total{' '}
            <span className="font-semibold">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </section>

      {/* Endereço */}
      <section className="mt-6 rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
        <h2 className="mb-3 text-lg font-medium">Endereço</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 outline-none placeholder:text-white/40"
            placeholder="Nome *"
            value={address.nome}
            onChange={onChange('nome')}
          />
          <input
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 outline-none placeholder:text-white/40"
            placeholder="Telefone *"
            value={address.telefone}
            onChange={onChange('telefone')}
          />
          <input
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 outline-none placeholder:text-white/40"
            placeholder="CEP *"
            value={address.cep}
            onChange={(e) => handleCepChange(e.target.value)}
          />
          <input
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 outline-none placeholder:text-white/40"
            placeholder="Rua *"
            value={address.rua}
            onChange={onChange('rua')}
          />
          <input
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 outline-none placeholder:text-white/40"
            placeholder="Número *"
            value={address.numero}
            onChange={onChange('numero')}
          />
          <input
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 outline-none placeholder:text-white/40"
            placeholder="Bairro"
            value={address.bairro ?? ''}
            onChange={onChange('bairro')}
          />
          <input
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 outline-none placeholder:text-white/40"
            placeholder="Cidade *"
            value={address.cidade}
            onChange={onChange('cidade')}
          />
          <input
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 outline-none placeholder:text-white/40"
            placeholder="Estado *"
            value={address.estado}
            onChange={onChange('estado')}
          />
          <input
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 outline-none placeholder:text-white/40 md:col-span-2"
            placeholder="Complemento"
            value={address.complemento ?? ''}
            onChange={onChange('complemento')}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
            Finalizar pedido
          </button>
        </div>
      </section>
    </main>
  );
}