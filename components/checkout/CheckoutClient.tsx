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
  const { items, remove, setQty, clear, subtotal } = useCart(); // ✅ agora é remove

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

  // Auto-preenche endereço ao digitar CEP
  useEffect(() => {
    const cep = addr.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (data.erro) return;
          setAddr((a) => ({
            ...a,
            street: data.logradouro || '',
            city: data.localidade || '',
            state: data.uf || '',
          }));
        })
        .catch(() => {});
    }
  }, [addr.cep]);

  const total = subtotal;

  function finalizeOrder() {
    const msg = encodeURIComponent(
      `Novo pedido - Loja da Jane:\n\n${items
        .map((i) => `${i.qty}x ${i.title} — R$${i.price.toFixed(2)}`)
        .join('\n')}\n\nTotal: R$${total.toFixed(
        2
      )}\n\nEndereço:\n${addr.street}, ${addr.number}, ${addr.city}/${addr.state}\nCEP: ${
        addr.cep
      }\nComplemento: ${addr.complement || '-'}\n\nCliente: ${addr.name}\nTelefone: ${
        addr.phone
      }`
    );

    window.open(`https://wa.me/5544988606483?text=${msg}`, '_blank');
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white space-y-8">
      <h1 className="text-2xl font-bold">Carrinho</h1>

      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-neutral-800 rounded-xl p-4"
              >
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p>R$ {item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="bg-neutral-700 px-3 py-1 rounded-lg"
                    onClick={() =>
                      setQty(item.id, Math.max(1, item.qty - 1))
                    }
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    className="bg-neutral-700 px-3 py-1 rounded-lg"
                    onClick={() => setQty(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>

                <div>
                  <p className="font-semibold">
                    R$ {(item.price * item.qty).toFixed(2)}
                  </p>
                  <button
                    className="text-rose-400 mt-1"
                    onClick={() => remove(item.id)} // ✅ usa remove()
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right text-lg mt-4">
            <p>Total: R$ {total.toFixed(2)}</p>
          </div>

          <div className="bg-neutral-900 rounded-xl p-4 space-y-3">
            <h2 className="text-xl font-semibold">Endereço</h2>

            <input
              className="w-full p-3 rounded-lg bg-neutral-800"
              placeholder="Nome completo"
              value={addr.name}
              onChange={(e) => setAddr({ ...addr, name: e.target.value })}
            />
            <input
              className="w-full p-3 rounded-lg bg-neutral-800"
              placeholder="Telefone"
              value={addr.phone}
              onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
            />
            <input
              className="w-full p-3 rounded-lg bg-neutral-800"
              placeholder="CEP"
              value={addr.cep}
              onChange={(e) => setAddr({ ...addr, cep: e.target.value })}
            />
            <input
              className="w-full p-3 rounded-lg bg-neutral-800"
              placeholder="Rua"
              value={addr.street}
              onChange={(e) => setAddr({ ...addr, street: e.target.value })}
            />
            <input
              className="w-full p-3 rounded-lg bg-neutral-800"
              placeholder="Número"
              value={addr.number}
              onChange={(e) => setAddr({ ...addr, number: e.target.value })}
            />
            <input
              className="w-full p-3 rounded-lg bg-neutral-800"
              placeholder="Cidade"
              value={addr.city}
              onChange={(e) => setAddr({ ...addr, city: e.target.value })}
            />
            <input
              className="w-full p-3 rounded-lg bg-neutral-800"
              placeholder="Estado"
              value={addr.state}
              onChange={(e) => setAddr({ ...addr, state: e.target.value })}
            />
            <input
              className="w-full p-3 rounded-lg bg-neutral-800"
              placeholder="Complemento"
              value={addr.complement}
              onChange={(e) => setAddr({ ...addr, complement: e.target.value })}
            />
          </div>

          <button
            onClick={finalizeOrder}
            className="w-full mt-6 py-4 bg-emerald-600 text-black font-semibold rounded-xl hover:bg-emerald-500 transition"
          >
            Finalizar pedido no WhatsApp
          </button>
        </>
      )}
    </div>
  );
}