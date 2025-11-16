"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const whatsappNumber = "5544988606483"; // 55 + 44 + 988606483

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!cart.length) return;

    const totalFormatted = total.toFixed(2).replace(".", ",");

    let message = `📦 *Novo pedido - Loja do Jane*\n\n`;

    message += `👤 *Cliente:* ${name}\n`;
    message += `📱 *Telefone:* ${phone}\n\n`;

    message += `📍 *Endereço:*\n`;
    message += `${street}, ${number}\n`;
    message += `${neighborhood} - ${city} / ${state}\n`;
    message += `CEP: ${cep}\n`;
    message += `Complemento: ${complement || "—"}\n\n`;

    message += `🧾 *Itens do pedido:*\n`;
    cart.forEach((item) => {
      const subtotal = (item.price * item.quantity)
        .toFixed(2)
        .replace(".", ",");
      message += `• ${item.quantity}x ${item.name} - R$ ${subtotal}\n`;
    });

    message += `\n💰 *Total:* R$ ${totalFormatted}\n\n`;
    message += `Por favor, confirme o pedido. 🙏`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");

    // limpa o carrinho depois de mandar o pedido
    clearCart();
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-2xl font-semibold text-emerald-500">
          Loja do Jane
        </Link>

        <Link
          href="/checkout"
          className="flex items-center gap-2 rounded-full border border-emerald-500/70 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/20 transition-colors"
        >
          <span className="text-lg">🛒</span>
          <span>
            {cart.length === 0
              ? "0 items"
              : `${cart.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )} items`}
          </span>
        </Link>
      </header>

      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-200 mb-4 inline-block"
      >
        ← Voltar para a loja
      </Link>

      <h1 className="text-3xl font-semibold mb-2">Endereço</h1>
      <p className="text-zinc-400 mb-6 text-sm">
        Preencha seus dados para finalizar o pedido.
      </p>

      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nome completo *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Telefone / WhatsApp *</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">CEP *</label>
            <input
              required
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Rua *</label>
            <input
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Número *</label>
              <input
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Complemento</label>
              <input
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Bairro *</label>
            <input
              required
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-[3fr,1fr] gap-4">
            <div>
              <label className="block text-sm mb-1">Cidade *</label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">UF *</label>
              <input
                required
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                maxLength={2}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-center outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!cart.length}
            className="w-full mt-4 rounded-full bg-emerald-500 text-black font-semibold py-3 shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Finalizar pedido pelo WhatsApp
          </button>
        </form>

        {/* RESUMO DO PEDIDO */}
        <aside className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="text-lg font-semibold mb-4">Resumo do pedido</h2>

          {cart.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Seu carrinho está vazio. Adicione produtos na loja para continuar.
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-900">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-zinc-500">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-emerald-400">
                      R${" "}
                      {(item.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-2">
                <span className="font-medium">Total</span>
                <span className="text-lg font-semibold text-emerald-400">
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <Link
                href="/"
                className="mt-4 inline-block text-xs text-zinc-400 hover:text-zinc-200"
              >
                ← Voltar para a loja
              </Link>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}