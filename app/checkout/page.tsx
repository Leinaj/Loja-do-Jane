"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CheckoutPage() {
  const { cart, clearCart, getCartTotal } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const total = getCartTotal();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!cart.length) {
      setError("Seu carrinho está vazio.");
      return;
    }

    if (!name || !phone || !cep || !street || !number || !city) {
      setError("Preencha os campos obrigatórios marcados com *.");
      return;
    }

    setError("");

    const itensTexto = cart
      .map(
        (item) =>
          `- ${item.name} (Qtd: ${item.quantity}) — ${formatCurrency(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const message = `
*Novo pedido - Loja do Jane*

*Itens:*
${itensTexto}

*Total:* ${formatCurrency(total)}

*Cliente:*
Nome: ${name}
WhatsApp: ${phone}

*Endereço:*
CEP: ${cep}
Rua: ${street}, ${number}${complement ? " - " + complement : ""}
Bairro: ${district || "-"}
Cidade: ${city}
`.trim();

    // Coloca aqui o número do seu WhatsApp no formato internacional, ex: 5544999999999
    const phoneNumber = "5544999999999";

    if (typeof window !== "undefined") {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    }

    clearCart();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-500/20 bg-black/90 px-4 py-3 backdrop-blur-md">
        <Link
          href="/"
          className="text-lg font-semibold text-emerald-400 hover:text-emerald-300"
        >
          Loja do Jane
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-emerald-400/40 px-4 py-1 text-xs font-medium text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.5)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-95"
        >
          Voltar para a loja
        </Link>
      </header>

      <section className="px-4 pb-16 pt-6">
        <h1 className="text-2xl font-semibold">Finalizar pedido</h1>

        {/* RESUMO DO PEDIDO COM MINIATURAS */}
        <div className="mt-4 rounded-3xl border border-emerald-500/30 bg-black/60 p-4 shadow-[0_0_22px_rgba(16,185,129,0.3)]">
          <h2 className="text-lg font-semibold text-emerald-300">
            Resumo do pedido
          </h2>

          {cart.length === 0 ? (
            <p className="mt-3 text-sm text-gray-400">
              Seu carrinho está vazio.
            </p>
          ) : (
            <>
              <div className="mt-3 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.slug}
                    className="flex items-center gap-3 rounded-2xl bg-emerald-500/5 px-2 py-2"
                  >
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-emerald-500/40 bg-black/40">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        Qtd: {item.quantity} ·{" "}
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-emerald-500/20 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-300">Total</span>
                <span className="text-xl font-semibold text-emerald-400">
                  {formatCurrency(total)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* FORMULÁRIO DE DADOS */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm">
              Nome completo <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
              placeholder="(44) 9 9999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              CEP <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
              placeholder="00000-000"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Rua <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
              placeholder="Nome da rua"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm">
                Número <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
                placeholder="123"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-sm">Complemento</label>
              <input
                className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
                placeholder="Apto, bloco, casa..."
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Bairro</label>
            <input
              className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
              placeholder="Seu bairro"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Cidade <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/60"
              placeholder="Sua cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {error && (
            <p className="pt-1 text-sm font-medium text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={!cart.length}
            className="mt-2 w-full rounded-full bg-emerald-500 py-4 text-center text-base font-semibold text-black shadow-[0_0_28px_rgba(16,185,129,0.8)] transition-all duration-150 hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:bg-emerald-500/40 disabled:text-emerald-900"
          >
            Enviar pedido pelo WhatsApp
          </button>
        </form>
      </section>
    </main>
  );
}