// app/checkout/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";

// antes
// const WHATSAPP_NUMBER = "5544999999999";

// depois
const WHATSAPP_NUMBER = "5544988606483";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [isSending, setIsSending] = useState(false);

  const total = getCartTotal();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!cart.length) {
      alert("Seu carrinho está vazio.");
      return;
    }

    if (!fullName || !whatsapp || !cep || !street || !number || !city) {
      alert("Preencha os campos obrigatórios para enviar o pedido.");
      return;
    }

    setIsSending(true);

    const itensTexto = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} — Qtd: ${item.quantity} — R$ ${(item.price * item.quantity)
            .toFixed(2)
            .replace(".", ",")}`
      )
      .join("\n");

    const mensagemWhatsApp = `✨ *Pedido confirmado na Loja do Jane* ✨

🛒 *Resumo do pedido*
${itensTexto}

💰 *Total:* R$ ${total.toFixed(2).replace(".", ",")}

👤 *Dados do cliente*
Nome: ${fullName}
WhatsApp: ${whatsapp}

📍 *Endereço para entrega*
Rua: ${street}, ${number}${complement ? " - " + complement : ""}
Bairro: ${neighborhood || "-"}
Cidade: ${city}
CEP: ${cep}

⏱ *Próximos passos*
Por favor, confirme a disponibilidade dos produtos, o valor do frete e o prazo de entrega.

Muito obrigado! 🙌`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      mensagemWhatsApp
    )}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }

    // limpa o carrinho depois de enviar o pedido
    clearCart();
    setIsSending(false);
  }

  if (!cart.length) {
    return (
      <main className="px-4 pb-20 pt-6 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">
          Seu carrinho está vazio
        </h1>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-emerald-400/60 px-6 py-3 text-emerald-300 hover:bg-emerald-500/10 transition"
        >
          Voltar para a loja
        </Link>
      </main>
    );
  }

  return (
    <main className="px-4 pb-24 pt-6 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-6">Finalizar pedido</h1>

      {/* RESUMO DO PEDIDO */}
      <section className="mb-8 rounded-3xl border border-emerald-400/25 bg-black/70 p-5 shadow-[0_0_80px_rgba(16,185,129,0.35)]">
        <h2 className="text-xl font-semibold text-emerald-300 mb-4">
          Resumo do pedido
        </h2>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.slug}
              className="flex items-center gap-4 rounded-2xl bg-emerald-900/25 px-4 py-3"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-emerald-500/40 bg-black/40">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>

              <div className="flex-1">
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-xs text-emerald-200/80">
                  Qtd: {item.quantity} · R${" "}
                  {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-emerald-500/30 pt-3">
          <span className="text-sm text-emerald-200">Total</span>
          <span className="text-lg font-bold text-emerald-400">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-emerald-500/20 bg-black/70 p-5"
      >
        <div>
          <label className="mb-1 block text-sm text-emerald-100">
            Nome completo *
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-emerald-100">
            WhatsApp *
          </label>
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
            placeholder="(44) 9 9999-9999"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-emerald-100">CEP *</label>
          <input
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
            placeholder="00000-000"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-emerald-100">Rua *</label>
          <input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
            placeholder="Nome da rua"
            required
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm text-emerald-100">
              Número *
            </label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
              placeholder="123"
              required
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm text-emerald-100">
              Complemento
            </label>
            <input
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              className="w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
              placeholder="Apto, bloco, casa..."
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-emerald-100">
            Bairro
          </label>
          <input
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
            placeholder="Seu bairro"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-emerald-100">
            Cidade *
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-full border border-emerald-500/40 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
            placeholder="Sua cidade"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="mt-3 flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_0_45px_rgba(16,185,129,0.75)] transition hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? "Enviando pedido..." : "Enviar pedido pelo WhatsApp"}
        </button>
      </form>
    </main>
  );
}