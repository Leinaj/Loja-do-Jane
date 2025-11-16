// app/checkout/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type CheckoutForm = {
  name: string;
  whatsapp: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
};

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    whatsapp: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
  });

  const total = getCartTotal();

  function handleChange(field: keyof CheckoutForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!cart.length) return;

    setSending(true);

    const itemsText = cart
      .map(
        (item) =>
          `• ${item.name} (Qtd: ${item.quantity}) - ${formatCurrency(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const message =
      `*Novo pedido - Loja do Jane*\n\n` +
      `*Itens:*\n${itemsText}\n\n` +
      `*Total:* ${formatCurrency(total)}\n\n` +
      `*Dados do cliente:*\n` +
      `Nome: ${form.name}\n` +
      `WhatsApp: ${form.whatsapp}\n` +
      `Endereço: ${form.street}, ${form.number} - ${form.neighborhood}\n` +
      `Cidade: ${form.city}\n` +
      (form.complement ? `Complemento: ${form.complement}\n` : "") +
      `CEP: ${form.cep}`;

    const phoneDigits = form.whatsapp.replace(/\D/g, "");
    const url = `https://wa.me/55${phoneDigits}?text=${encodeURIComponent(
      message
    )}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }

    setSending(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER ÚNICO */}
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

      <section className="px-4 pb-20 pt-6">
        <h1 className="text-2xl font-semibold">Finalizar pedido</h1>

        {/* RESUMO DO PEDIDO COM MINIATURAS */}
        <div className="mt-5 rounded-3xl border border-emerald-500/20 bg-black/60 p-4 shadow-[0_0_26px_rgba(16,185,129,0.6)]">
          <h2 className="text-lg font-medium text-emerald-300">
            Resumo do pedido
          </h2>

          <div className="mt-4 space-y-3">
            {cart.map((item) => (
              <div
                key={item.slug}
                className="flex items-center gap-3 rounded-2xl bg-black/60 px-3 py-2"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-black/40">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
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

          <div className="mt-4 flex items-center justify-between border-t border-emerald-500/20 pt-3 text-sm">
            <span className="text-gray-300">Total</span>
            <span className="text-lg font-semibold text-emerald-400">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-300">
              Nome completo <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-2 w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400 focus:bg-black/80"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-2 w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400 focus:bg-black/80"
              placeholder="(44) 9 9999-9999"
              value={form.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              CEP <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-2 w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400 focus:bg-black/80"
              placeholder="00000-000"
              value={form.cep}
              onChange={(e) => handleChange("cep", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Rua <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-2 w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400 focus:bg-black/80"
              placeholder="Nome da rua"
              value={form.street}
              onChange={(e) => handleChange("street", e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm text-gray-300">
                Número <span className="text-red-400">*</span>
              </label>
              <input
                className="mt-2 w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400 focus:bg-black/80"
                placeholder="123"
                value={form.number}
                onChange={(e) => handleChange("number", e.target.value)}
                required
              />
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-300">Complemento</label>
              <input
                className="mt-2 w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400 focus:bg-black/80"
                placeholder="Apto, bloco, casa..."
                value={form.complement}
                onChange={(e) => handleChange("complement", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300">Bairro</label>
            <input
              className="mt-2 w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400 focus:bg-black/80"
              placeholder="Seu bairro"
              value={form.neighborhood}
              onChange={(e) => handleChange("neighborhood", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Cidade <span className="text-red-400">*</span>
            </label>
            <input
              className="mt-2 w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-400 focus:bg-black/80"
              placeholder="Sua cidade"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending || !cart.length}
            className="mt-4 w-full rounded-full bg-emerald-500 py-4 text-center text-base font-semibold text-black shadow-[0_0_30px_rgba(16,185,129,0.9)] transition-all duration-150 hover:bg-emerald-400 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-emerald-900 disabled:text-emerald-600"
          >
            {sending ? "Enviando pedido..." : "Enviar pedido pelo WhatsApp"}
          </button>
        </form>
      </section>
    </main>
  );
}