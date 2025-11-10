'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// use o caminho correto do seu contexto de carrinho
import { useCart as useCartBase } from '@/components/cart/context';

type Endereco = {
  nome: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CheckoutPage() {
  // Faz o cast para any aqui para evitar erros de tipos diferentes
  const cart = (useCartBase() as any) || {};
  const items: any[] = cart.items ?? [];

  // endereço
  const [end, setEnd] = useState<Endereco>({
    nome: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  // cupom e frete
  const [cupom, setCupom] = useState('');
  const [cupomValido, setCupomValido] = useState(false);
  const [frete, setFrete] = useState(24.4); // valor base

  // Subtotal calculado pelos itens
  const subtotal = useMemo(
    () =>
      items.reduce((acc, it) => {
        const price = Number(it?.price ?? it?.preco ?? 0);
        const qty = Number(it?.quantity ?? it?.qty ?? 1);
        return acc + price * qty;
      }, 0),
    [items]
  );

  const desconto = cupomValido ? subtotal * 0.1 : 0; // JANE10 = 10%
  const total = Math.max(0, subtotal - desconto) + (items.length ? frete : 0);

  // Autocomplete por CEP (ViaCEP)
  useEffect(() => {
    const cep = end.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    let cancel = false;
    (async () => {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!cancel && !data.erro) {
          setEnd((e) => ({
            ...e,
            rua: data.logradouro || e.rua,
            bairro: data.bairro || e.bairro,
            cidade: data.localidade || e.cidade,
            estado: data.uf || e.estado,
          }));
        }
      } catch {}
    })();
    return () => {
      cancel = true;
    };
  }, [end.cep]);

  // handlers
  const aplicarCupom = () => {
    const ok = cupom.trim().toUpperCase() === 'JANE10';
    setCupomValido(ok);
    if (ok) cart.applyCoupon?.(cupom.trim());
  };

  const limparCarrinho = () => cart.clear?.();
  const removerItem = (id: string | number) => cart.removeItem?.(id);
  const alterarQtd = (id: string | number, nextQty: number) => {
    if (nextQty < 1) return;
    cart.updateItemQuantity?.(id, nextQty);
    cart.setQuantity?.(id, nextQty);
    cart.updateItem?.(id, { quantity: nextQty });
  };

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500';
  const btnCls =
    'inline-flex items-center justify-center rounded-xl px-4 py-3 font-medium transition';
  const btnPrimary = `${btnCls} bg-emerald-600 hover:bg-emerald-500 text-white`;
  const btnOutline =
    `${btnCls} border border-white/10 bg-transparent hover:bg-white/5 text-white`;
  const cardCls = 'rounded-2xl border border-white/10 bg-black/20 backdrop-blur';

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 space-y-10">
      <h1 className="text-3xl font-semibold text-white">Carrinho</h1>

      {/* Lista de itens */}
      <div className={cardCls}>
        <div className="p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-white/70">Seu carrinho está vazio.</p>
              <Link href="/" className={btnPrimary}>
                Voltar para a loja
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((it) => (
                <div
                  key={String(it.id ?? it.slug)}
                  className="flex items-center gap-4 rounded-xl border border-white/10 p-3"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-black/30">
                    {it.image && (
                      <Image
                        src={it.image}
                        alt={it.name ?? 'Produto'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-white">
                      {it.name ?? it.title ?? 'Produto'}
                    </p>
                    <p className="text-sm text-white/70">
                      {brl(Number(it.price ?? it.preco ?? 0))}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className={btnOutline + ' h-10 w-10'}
                      onClick={() =>
                        alterarQtd(
                          it.id ?? it.slug,
                          Number(it.quantity ?? 1) - 1
                        )
                      }
                    >
                      –
                    </button>
                    <span className="w-8 text-center text-white">
                      {Number(it.quantity ?? 1)}
                    </span>
                    <button
                      className={btnOutline + ' h-10 w-10'}
                      onClick={() =>
                        alterarQtd(
                          it.id ?? it.slug,
                          Number(it.quantity ?? 1) + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={`${btnCls} bg-red-600 hover:bg-red-500 text-white`}
                    onClick={() => removerItem(it.id ?? it.slug)}
                  >
                    Remover
                  </button>
                </div>
              ))}

              <div className="flex justify-between">
                <button className={btnOutline} onClick={limparCarrinho}>
                  Limpar carrinho
                </button>
                <Link href="/" className={btnOutline}>
                  Voltar para a loja
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Endereço + Resumo */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Endereço */}
        <div className={`${cardCls} lg:col-span-2`}>
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Endereço</h2>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-white/80">Nome *</label>
              <input
                className={inputCls}
                value={end.nome}
                onChange={(e) => setEnd({ ...end, nome: e.target.value })}
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Telefone *</label>
              <input
                className={inputCls}
                value={end.telefone}
                onChange={(e) => setEnd({ ...end, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">CEP *</label>
              <input
                className={inputCls}
                value={end.cep}
                onChange={(e) => setEnd({ ...end, cep: e.target.value })}
                placeholder="00000-000"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-white/80">Rua *</label>
              <input
                className={inputCls}
                value={end.rua}
                onChange={(e) => setEnd({ ...end, rua: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Número *</label>
              <input
                className={inputCls}
                value={end.numero}
                onChange={(e) => setEnd({ ...end, numero: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Complemento</label>
              <input
                className={inputCls}
                value={end.complemento}
                onChange={(e) => setEnd({ ...end, complemento: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Bairro *</label>
              <input
                className={inputCls}
                value={end.bairro}
                onChange={(e) => setEnd({ ...end, bairro: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Cidade *</label>
              <input
                className={inputCls}
                value={end.cidade}
                onChange={(e) => setEnd({ ...end, cidade: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Estado *</label>
              <input
                className={inputCls}
                value={end.estado}
                onChange={(e) => setEnd({ ...end, estado: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className={cardCls}>
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Resumo</h2>
          </div>
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <label className="mb-2 block text-sm text-white/80">
                Cupom de desconto
              </label>
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  placeholder="JANE10"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                />
                <button className={btnOutline} onClick={aplicarCupom}>
                  Aplicar
                </button>
              </div>
              {cupomValido ? (
                <p className="text-sm text-emerald-400">
                  Cupom aplicado: 10% de desconto
                </p>
              ) : cupom ? (
                <p className="text-sm text-white/70">
                  Dica: use <b>JANE10</b> para 10% OFF
                </p>
              ) : null}
            </div>

            <div className="space-y-1 text-sm text-white">
              <div className="flex justify-between">
                <span className="text-white/80">Subtotal</span>
                <span>{brl(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Desconto</span>
                <span>– {brl(desconto)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Frete • PAC (5–8 dias)</span>
                <span>{items.length ? brl(frete) : brl(0)}</span>
              </div>
              <div className="mt-2 border-t border-white/10 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{brl(total)}</span>
              </div>
            </div>

            <button className={btnPrimary + ' w-full'} disabled={!items.length}>
              Finalizar pedido
            </button>
            <Link href="/" className={btnOutline + ' w-full text-center'}>
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}