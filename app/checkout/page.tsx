"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { money } from "@/lib/products";

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

const INITIAL_ADDR: Address = {
  name: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  city: "",
  state: "",
};

export default function CheckoutPage() {
  const { items, remove, clear } = useCart();
  const [address, setAddress] = useState<Address>(INITIAL_ADDR);
  const [error, setError] = useState<string>("");
  const [okMsg, setOkMsg] = useState<string>("");

  // refs pra focar no primeiro campo vazio
  const refs = {
    name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    cep: useRef<HTMLInputElement>(null),
    street: useRef<HTMLInputElement>(null),
    number: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    state: useRef<HTMLInputElement>(null),
  };

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.product.price * it.q, 0),
    [items]
  );

  function onChange<K extends keyof Address>(key: K, v: string) {
    setAddress((a) => ({ ...a, [key]: v }));
  }

  function validate(): keyof Address | null {
    const required: (keyof Address)[] = ["name", "phone", "cep", "street", "number", "city", "state"];
    for (const k of required) {
      if (!address[k]?.trim()) return k;
    }
    return null;
  }

  function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOkMsg("");

    const missing = validate();
    if (missing) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      refs[missing].current?.focus();
      return;
    }

    // sucesso “fake” (ex.: envio pro WhatsApp/planilha se quiser depois)
    setOkMsg(
      `Pedido recebido! Total: ${money(total)} — Entrega: ${address.street}, ${address.number} — ${address.city}/${address.state}`
    );

    clear(); // esvazia o carrinho somente após sucesso
    setAddress(INITIAL_ADDR);
  }

  return (
    <main className="max-w-4xl mx-auto p-4 text-white">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <Link href="/" className="text-sm text-neutral-300 hover:underline">← Continuar comprando</Link>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Formulário */}
        <form onSubmit={submitOrder} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
          <div className="grid grid-cols-1 gap-3">
            <input ref={refs.name}   value={address.name}   onChange={(e)=>onChange("name", e.target.value)}   placeholder="Nome completo *" className="input" />
            <input ref={refs.phone}  value={address.phone}  onChange={(e)=>onChange("phone", e.target.value)}  placeholder="Telefone *" className="input" />
            <input ref={refs.cep}    value={address.cep}    onChange={(e)=>onChange("cep", e.target.value)}    placeholder="CEP *" className="input" />
            <input ref={refs.street} value={address.street} onChange={(e)=>onChange("street", e.target.value)} placeholder="Rua *" className="input" />
            <input ref={refs.number} value={address.number} onChange={(e)=>onChange("number", e.target.value)} placeholder="Número *" className="input" />
            <input ref={refs.city}   value={address.city}   onChange={(e)=>onChange("city", e.target.value)}   placeholder="Cidade *" className="input" />
            <input ref={refs.state}  value={address.state}  onChange={(e)=>onChange("state", e.target.value)}  placeholder="Estado *" className="input" />
          </div>

          <button type="submit" className="mt-4 w-full bg-green-700 hover:bg-green-600 py-3 rounded-md font-medium">
            Finalizar pedido
          </button>

          {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
          {okMsg && <p className="mt-3 text-green-400 text-sm">{okMsg}</p>}
        </form>

        {/* Resumo */}
        <section className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
          <h2 className="font-medium mb-3">Seu carrinho</h2>
          <div className="space-y-3">
            {items.length === 0 && <p className="text-neutral-400">Seu carrinho está vazio.</p>}
            {items.map((it) => (
              <div key={it.product.id} className="flex items-center justify-between bg-neutral-800 rounded-lg p-3">
                <div>
                  <p className="font-medium">{it.product.title}</p>
                  <p className="text-neutral-400 text-sm">{it.q} × {money(it.product.price)}</p>
                </div>
                <button onClick={() => remove(it.product.id)} className="text-sm text-red-300 hover:text-red-200">
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-3">
            <span className="text-neutral-300">Total</span>
            <strong>{money(total)}</strong>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .input {
          background: #111213;
          border: 1px solid #2a2b2d;
          padding: 0.75rem 0.9rem;
          border-radius: 0.6rem;
          outline: none;
        }
        .input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,.2);
        }
      `}</style>
    </main>
  );
}