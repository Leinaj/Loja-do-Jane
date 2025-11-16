// app/checkout/page.tsx
"use client";

import { FormEvent } from "react";
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
  const { cart, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const name = (data.get("name") || "").toString();
    const phone = (data.get("whatsapp") || "").toString();
    const cep = (data.get("cep") || "").toString();
    const street = (data.get("street") || "").toString();
    const number = (data.get("number") || "").toString();
    const complement = (data.get("complement") || "").toString();
    const neighborhood = (data.get("neighborhood") || "").toString();
    const city = (data.get("city") || "").toString();

    const itemsText = cart
      .map(
        (item) =>
          `• ${item.name} (Qtd: ${item.quantity}) — ${formatCurrency(
            item.price * item.quantity
          )}`
      )
      .join("%0A");

    const address = `${street}, ${number} ${complement} - ${neighborhood} - ${city} - CEP ${cep}`;

    const message = `Olá, tenho interesse nesses produtos na Loja do Jane:%0A%0A${itemsText}%0A%0ATotal: ${formatCurrency(
      total
    )}%0A%0ANome: ${name}%0AWhatsApp: ${phone}%0AEndereço: ${address}`;

    // COLOQUE AQUI SEU NÚMERO DE WHATSAPP COM DDD, SEM +55
    const storePhone = "44999999999";
    const url = `https://wa.me/55${storePhone}?text=${message}`;

    window.open(url, "_blank");
    clearCart();
  }

  if (cart.length === 0) {
    return (
      <main className="px-4 pb-20 pt-6">
        <header className="mb-6 flex justify-end">
          <Link
            href="/"
            className="rounded-full border border-emerald-500/60 bg-black/60 px-4 py-2 text-sm font-semibold text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.6)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-[0.97]"
          >
            Voltar para a loja
          </Link>
        </header>

        <p className="text-center text-gray-300">
          Seu carrinho está vazio. Adicione algum produto para finalizar o
          pedido.
        </p>
      </main>
    );
  }

  return (
    <main className="px-4 pb-20 pt-6">
      {/* SÓ O BOTÃO, SEM O TÍTULO DUPLICADO */}
      <header className="mb-6 flex justify-end">
        <Link
          href="/"
          className="rounded-full border border-emerald-500/60 bg-black/60 px-4 py-2 text-sm font-semibold text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.6)] transition-all duration-150 hover:bg-emerald-500/10 active:scale-[0.97]"
        >
          Voltar para a loja
        </Link>
      </header>

      <h1 className="mb-4 text-3xl font-semibold">Finalizar pedido</h1>

      {/* RESUMO DO PEDIDO */}
      <section className="mb-8 rounded-3xl border border-emerald-500/30 bg-black/70 p-4 shadow-[0_0_30px_rgba(16,185,129,0.7)]">
        <h2 className="mb-4 text-xl font-semibold text-emerald-300">
          Resumo do pedido
        </h2>

        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.slug}
              className="flex items-center justify-between rounded-2xl bg-emerald-500/5 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-emerald-500/40 bg-black/60">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-300">
                    Qtd: {item.quantity} ·{" "}
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-emerald-500/20 pt-3">
          <span className="text-sm font-medium">Total</span>
          <span className="text-lg font-bold text-emerald-400">
            {formatCurrency(total)}
          </span>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-emerald-500/20 bg-black/70 p-4"
      >
        <div>
          <label className="mb-1 block text-sm" htmlFor="name">
            Nome completo *
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Seu nome completo"
            className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm" htmlFor="whatsapp">
            WhatsApp *
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            required
            placeholder="(44) 9 9999-9999"
            className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm" htmlFor="cep">
            CEP *
          </label>
          <input
            id="cep"
            name="cep"
            required
            placeholder="00000-000"
            className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm" htmlFor="street">
            Rua *
          </label>
          <input
            id="street"
            name="street"
            required
            placeholder="Nome da rua"
            className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm" htmlFor="number">
              Número *
            </label>
            <input
              id="number"
              name="number"
              required
              placeholder="123"
              className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm" htmlFor="complement">
              Complemento
            </label>
            <input
              id="complement"
              name="complement"
              placeholder="Apto, bloco, casa..."
              className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm" htmlFor="neighborhood">
            Bairro
          </label>
          <input
            id="neighborhood"
            name="neighborhood"
            placeholder="Seu bairro"
            className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm" htmlFor="city">
            Cidade *
          </label>
          <input
            id="city"
            name="city"
            required
            placeholder="Sua cidade"
            className="w-full rounded-full border border-emerald-500/30 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-emerald-500 py-3 text-center text-base font-semibold text-black shadow-[0_0_26px_rgba(16,185,129,0.8)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.97]"
        >
          Enviar pedido pelo WhatsApp
        </button>
      </form>
    </main>
  );
}