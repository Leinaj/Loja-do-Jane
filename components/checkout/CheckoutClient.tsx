'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/lib/cart';

type Address = {
  name: string;
  phone: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: string;
};

export default function CheckoutClient() {
  const { items, remove, clear, setQty } = useCart();

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.qty, 0),
    [items]
  );

  const [addr, setAddr] = useState<Address>({
    name: '', phone: '', cep: '', rua: '', numero: '',
    bairro: '', cidade: '', uf: '', complemento: ''
  });

  // CEP -> ViaCEP
  async function fillByCep(cep: string) {
    const only = cep.replace(/\D/g, '');
    if (only.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${only}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddr(a => ({
          ...a,
          rua: data.logradouro || a.rua,
          bairro: data.bairro || a.bairro,
          cidade: data.localidade || a.cidade,
          uf: data.uf || a.uf,
        }));
      }
    } catch {}
  }

  function onFinish() {
    const linhas = [
      '*Novo pedido*',
      '',
      '*Itens:*',
      ...items.map(i => `• ${i.qty} × ${i.name} — R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}`),
      '',
      `*Total:* R$ ${total.toFixed(2).replace('.', ',')}`,
      '',
      '*Dados do cliente:*',
      `Nome: ${addr.name}`,
      `Telefone: ${addr.phone}`,
      `Endereço: ${addr.rua}, ${addr.numero} - ${addr.bairro}`,
      `Cidade/UF: ${addr.cidade}/${addr.uf}`,
      addr.complemento ? `Compl.: ${addr.complemento}` : '',
      `CEP: ${addr.cep}`,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/5544988606483?text=${encodeURIComponent(linhas)}`;
    window.location.href = url;
  }

  return (
    <div className="space-y-6">
      {/* Lista do carrinho */}
      <div className="rounded-3xl bg-black/20 p-5">
        <h2 className="text-xl font-semibold mb-3">Carrinho</h2>

        {items.map(i => (
          <div key={i.id} className="flex items-center justify-between rounded-2xl bg-black/20 p-4 mb-3">
            <div className="min-w-0">
              <div className="font-medium">{i.name}</div>
              <div className="text-sm opacity-80">R$ {i.price.toFixed(2).replace('.', ',')}</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setQty(i.id, i.qty - 1)} className="w-10 h-10 rounded-xl bg-black/30">−</button>
              <div className="w-8 text-center">{i.qty}</div>
              <button onClick={() => setQty(i.id, i.qty + 1)} className="w-10 h-10 rounded-xl bg-black/30">+</button>
            </div>

            <div className="w-28 text-right">R$ {(i.price * i.qty).toFixed(2).replace('.', ',')}</div>
            <button onClick={() => remove(i.id)} className="ml-3 rounded-xl bg-rose-800 px-3 py-2">Remover</button>
          </div>
        ))}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Total: <span className="text-emerald-400">R$ {total.toFixed(2).replace('.', ',')}</span></div>
          <button onClick={clear} className="rounded-xl bg-black/40 px-4 py-2">Limpar carrinho</button>
        </div>
      </div>

      {/* Endereço (sem frete) */}
      <div className="rounded-3xl bg-black/20 p-5 space-y-3">
        <h2 className="text-xl font-semibold">Endereço</h2>

        <input className="w-full rounded-2xl bg-black/30 px-4 py-3"
               placeholder="Nome *" value={addr.name}
               onChange={e => setAddr({ ...addr, name: e.target.value })} />

        <input className="w-full rounded-2xl bg-black/30 px-4 py-3"
               placeholder="Telefone *" value={addr.phone}
               onChange={e => setAddr({ ...addr, phone: e.target.value })} />

        <input className="w-full rounded-2xl bg-black/30 px-4 py-3"
               placeholder="CEP *" value={addr.cep}
               onChange={e => setAddr({ ...addr, cep: e.target.value })}
               onBlur={e => fillByCep(e.target.value)} />

        <input className="w-full rounded-2xl bg-black/30 px-4 py-3"
               placeholder="Rua *" value={addr.rua}
               onChange={e => setAddr({ ...addr, rua: e.target.value })} />

        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-2xl bg-black/30 px-4 py-3"
                 placeholder="Número *" value={addr.numero}
                 onChange={e => setAddr({ ...addr, numero: e.target.value })}/>
          <input className="rounded-2xl bg-black/30 px-4 py-3"
                 placeholder="Bairro *" value={addr.bairro}
                 onChange={e => setAddr({ ...addr, bairro: e.target.value })}/>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-2xl bg-black/30 px-4 py-3"
                 placeholder="Cidade *" value={addr.cidade}
                 onChange={e => setAddr({ ...addr, cidade: e.target.value })}/>
          <input className="rounded-2xl bg-black/30 px-4 py-3"
                 placeholder="UF *" value={addr.uf}
                 onChange={e => setAddr({ ...addr, uf: e.target.value })}/>
        </div>

        <input className="w-full rounded-2xl bg-black/30 px-4 py-3"
               placeholder="Complemento" value={addr.complemento}
               onChange={e => setAddr({ ...addr, complemento: e.target.value })}/>
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3">
        <button onClick={onFinish} className="h-12 rounded-2xl bg-emerald-600 text-white font-medium">
          Finalizar pedido (WhatsApp)
        </button>
        <a href="/" className="h-12 rounded-2xl border border-white/20 flex items-center justify-center">
          Voltar para a loja
        </a>
      </div>
    </div>
  );
}