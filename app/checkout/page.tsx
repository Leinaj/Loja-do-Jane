"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { useCart } from "../cart-provider"; // <- AGORA VAI PRO ARQUIVO CERTO

type CepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

// número do WhatsApp da loja (com DDI 55)
const WHATSAPP_NUMBER = "5544988606483";

export default function CheckoutPage() {
  const { items, total, removeItem } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [stateUf, setStateUf] = useState("");

  const hasItems = items.length > 0;

  async function handleCepBlur() {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: CepResponse = await res.json();

      if (data.erro) return;

      setStreet(data.logradouro ?? "");
      setDistrict(data.bairro ?? "");
      setCity(data.localidade ?? "");
      setStateUf(data.uf ?? "");
    } catch {
      // se der erro na API, só não preenche nada
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!hasItems) return;

    const linhasProdutos = items
      .map(
        (item) =>
          `• ${item.name} — Qtd: ${item.quantity} — R$ ${brl(item.price)}`
      )
      .join("%0A");

    const endereco =
      `Nome: ${name}%0A` +
      `Telefone/WhatsApp: ${phone}%0A` +
      `CEP: ${cep}%0A` +
      `Rua: ${street}, Nº ${number}%0A` +
      `Compl.: ${complement}%0A` +
      `Bairro: ${district}%0A` +
      `Cidade: ${city} - ${stateUf}`;

    const mensagem =
      `Olá, quero finalizar este pedido:%0A%0A` +
      `Itens:%0A${linhasProdutos}%0A%0A` +
      `Total: R$ ${brl(total)}%0A%0A` +
      `Endereço:%0A${endereco}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`;
    window.open(url, "_blank");
  }

  // base dos inputs com animação suave no foco + glow
  const inputBase =
    "w-full rounded-full bg-black/80 border border-emerald-500/25 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 " +
    "transition-all duration-200 ease-out " +
    "focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/70 focus:ring-offset-2 focus:ring-offset-black " +
    "focus:shadow-[0_0_25px_rgba(16,185,129,0.35)]";

  return (
    <main className="min-h-screen bg-black text-zinc-50 px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        {/* CARD DO CARRINHO */}
        <section className="rounded-3xl bg-zinc-950 border border-zinc-800/80 p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <h1 className="text-2xl font-semibold mb-4">Carrinho</h1>

          {!hasItems && (
            <p className="text-zinc-400">Seu carrinho está vazio.</p>
          )}

          {hasItems && (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-950">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-zinc-400">
                      Qtd: {item.quantity} • R$ {brl(item.price)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-full bg-pink-600/90 px-3 py-1 text-xs font-semibold text-white hover:bg-pink-500 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              ))}

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-zinc-900/80 px-4 py-3 border border-zinc-800">
                <span className="text-zinc-300 text-sm">Total:</span>
                <span className="text-2xl font-semibold text-emerald-400">
                  R$ {brl(total)}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* CARD DO ENDEREÇO COM GLOW */}
        <section className="relative rounded-[32px] bg-gradient-to-b from-emerald-500/10 via-black to-black p-[1px] shadow-[0_0_80px_rgba(16,185,129,0.35)]">
          <div className="rounded-[30px] bg-zinc-950/95 border border-emerald-500/20 px-5 py-7 sm:px-7 sm:py-8">
            <h2 className="text-xl font-semibold mb-6">Endereço</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">
                  Nome <span className="text-pink-400">*</span>
                </label>
                <input
                  className={inputBase}
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">
                  Telefone / WhatsApp{" "}
                  <span className="text-pink-400">*</span>
                </label>
                <input
                  className={inputBase}
                  placeholder="(44) 9 9999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* CEP */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">
                  CEP <span className="text-pink-400">*</span>
                </label>
                <input
                  className={inputBase}
                  placeholder="87000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={handleCepBlur}
                  required
                />
              </div>

              {/* Rua */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">
                  Rua <span className="text-pink-400">*</span>
                </label>
                <input
                  className={inputBase}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>

              {/* Número / Complemento */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">
                    Número <span className="text-pink-400">*</span>
                  </label>
                  <input
                    className={inputBase}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Complemento</label>
                  <input
                    className={inputBase}
                    placeholder="Apto, bloco, referência…"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </div>
              </div>

              {/* Bairro */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">
                  Bairro <span className="text-pink-400">*</span>
                </label>
                <input
                  className={inputBase}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>

              {/* Cidade / UF */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm text-zinc-300">
                    Cidade <span className="text-pink-400">*</span>
                  </label>
                  <input
                    className={inputBase}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">
                    UF <span className="text-pink-400">*</span>
                  </label>
                  <input
                    className={inputBase}
                    placeholder="PR"
                    value={stateUf}
                    onChange={(e) => setStateUf(e.target.value.toUpperCase())}
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              {/* Botão WhatsApp */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <button
                  type="submit"
                  disabled={!hasItems}
                  className="w-full rounded-full bg-emerald-500 px-6 py-3 text-center text-sm font-semibold text-black shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.8)] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
                >
                  Finalizar compra no WhatsApp
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}