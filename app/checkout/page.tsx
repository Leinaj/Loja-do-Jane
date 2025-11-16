"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CheckoutPage() {
  const { cart, clearCart, getCartTotal } = useCart();
  const total = getCartTotal();

  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!cart.length) return;

    const phoneDigits = phone.replace(/\D/g, "");
    if (!phoneDigits) return;

    const itemsText = cart
      .map(
        (item) =>
          `• ${item.name} (Qtd: ${item.quantity}) - ${formatCurrency(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const totalText = formatCurrency(total);

    const address = `${street}, nº ${number}${
      complement ? `, ${complement}` : ""
    }, ${district} - ${city}/${uf}, CEP ${cep}`;

    const message = `📦 *Novo pedido - Loja do Jane*\n
👤 Cliente: ${name}
📞 Telefone: ${phone}

📍 Endereço:
${address}

🛒 Itens do pedido:
${itemsText}

💰 Total: ${totalText}
`;

    const url = `https://wa.me/55${phoneDigits}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
    clearCart();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-500/20 bg-black/90 px-4 py-3 backdrop-blur-md">
        <h1 className="text-lg font-semibold text-emerald-400">Loja do Jane</h1>
      </header>

      <section className="px-4 pb-16 pt-6">
        <h2 className="text-2xl font-semibold text-white">Finalizar pedido</h2>

        {/* 1) RESUMO DO PEDIDO PRIMEIRO */}
        <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-black/80 px-4 py-4 shadow-[0_0_22px_rgba(16,185,129,0.25)]">
          <h3 className="text-lg font-semibold text-white">Resumo do pedido</h3>

          {cart.length === 0 ? (
            <p className="mt-3 text-sm text-gray-400">
              Seu carrinho está vazio.
            </p>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                {cart.map((item) => (
                  <li
                    key={item.slug}
                    className="flex items-center justify-between gap-3 text-sm text-gray-200"
                  >
                    {/* miniatura */}
                    <div className="flex items-center gap-3">
                      <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-black/60">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="h-14 w-14 object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          Qtd: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Subtotal</p>
                      <p className="text-sm font-semibold text-emerald-400">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-emerald-500/20 pt-3">
                <span className="text-sm text-gray-300">Total</span>
                <span className="text-lg font-bold text-emerald-400">
                  {formatCurrency(total)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* 2) CAMPOS DE DADOS / ENDEREÇO */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Nome completo *</label>
            <input
              className="w-full rounded-2xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300">WhatsApp *</label>
            <input
              className="w-full rounded-2xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="(44) 9 9999-9999"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300">CEP *</label>
            <input
              className="w-full rounded-2xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300">Rua *</label>
            <input
              className="w-full rounded-2xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-sm text-gray-300">Número *</label>
              <input
                className="w-full rounded-2xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-sm text-gray-300">Complemento</label>
              <input
                className="w-full rounded-2xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-300">Bairro *</label>
            <input
              className="w-full rounded-2xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-sm text-gray-300">Cidade *</label>
              <input
                className="w-full rounded-2xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="w-20 space-y-1">
              <label className="text-sm text-gray-300">UF *</label>
              <input
                className="w-full rounded-2xl border border-emerald-500/30 bg-black/60 px-3 py-2 text-sm text-white uppercase outline-none focus:border-emerald-400"
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                maxLength={2}
                required
              />
            </div>
          </div>

          {/* BOTÃO WHATSAPP COM FEEDBACK */}
          <button
            type="submit"
            className="
              mt-6 w-full rounded-full bg-emerald-500
              py-4 text-center text-base font-semibold text-black
              shadow-[0_0_25px_rgba(16,185,129,0.7)]
              transition-all duration-150
              active:scale-95 active:bg-emerald-400
              focus:outline-none focus:ring-2 focus:ring-emerald-400/70
            "
            disabled={!cart.length}
          >
            Finalizar pedido pelo WhatsApp
          </button>
        </form>
      </section>
    </main>
  );
}