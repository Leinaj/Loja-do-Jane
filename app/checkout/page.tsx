"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

type CepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  async function handleCepBlur() {
    const rawCep = cep.replace(/\D/g, "");
    if (rawCep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data: CepResponse = await res.json();

      if (data.erro) return;

      setStreet(data.logradouro ?? "");
      setDistrict(data.bairro ?? "");
      setCity(data.localidade ?? "");
      setUf(data.uf ?? "");
    } catch (e) {
      console.error("Erro ao buscar CEP", e);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!items.length) {
      alert("Seu carrinho está vazio.");
      return;
    }

    // Depois você integra com WhatsApp bonitinho
    alert("Pedido enviado! Depois a gente liga isso no WhatsApp certinho. 😎");

    clearCart();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-8 flex flex-col gap-8">
        {/* Cabeçalho */}
        <header>
          <h1 className="text-2xl md:text-3xl font-semibold">Endereço</h1>
          <p className="text-zinc-400 text-sm mt-2">
            Preencha seus dados para finalizar o pedido.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-[2fr,1.5fr]">
          {/* Formulário */}
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 md:p-6 space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm text-zinc-200">Nome completo *</label>
              <input
                className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-zinc-200">
                Telefone / WhatsApp *
              </label>
              <input
                className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-zinc-200">CEP *</label>
              <input
                className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={handleCepBlur}
                required
              />
              <p className="text-[11px] text-zinc-500">
                Ao sair do campo, tentamos buscar o endereço automaticamente.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-zinc-200">Rua *</label>
              <input
                className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-[1.1fr,2fr] gap-3">
              <div className="space-y-1">
                <label className="text-sm text-zinc-200">Número *</label>
                <input
                  className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-zinc-200">Complemento</label>
                <input
                  className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto, bloco, referência..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-zinc-200">Bairro *</label>
              <input
                className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-[2fr,0.7fr] gap-3">
              <div className="space-y-1">
                <label className="text-sm text-zinc-200">Cidade *</label>
                <input
                  className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-zinc-200">UF *</label>
                <input
                  className="w-full rounded-xl bg-black border border-zinc-700 px-3 py-2 text-sm text-center uppercase outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition-all"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  required
                  maxLength={2}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-emerald-500 text-black font-semibold py-3 shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:bg-emerald-400 transition-colors"
            >
              Finalizar pedido
            </button>
          </form>

          {/* Resumo do pedido */}
          <aside className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 md:p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Resumo do pedido</h2>

            {items.length === 0 && (
              <p className="text-sm text-zinc-400">
                Seu carrinho está vazio.
              </p>
            )}

            <div className="space-y-3 max-h-72 overflow-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex gap-3 items-center border-b border-zinc-800 pb-3 last:border-0"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-950">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-zinc-400">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-emerald-400">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-zinc-300">Total</span>
              <span className="text-lg font-semibold text-emerald-400">
                R$ {total.toFixed(2)}
              </span>
            </div>

            <Link
              href="/"
              className="mt-2 text-xs text-zinc-400 hover:text-emerald-400 transition-colors text-center"
            >
              ← Voltar para a loja
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}