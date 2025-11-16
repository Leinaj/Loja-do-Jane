"use client";

import { useCart } from "@/app/contexts/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  const handleFinish = () => {
    if (!name || !phone || !cep || !street || !number || !district || !city || !uf) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const message = `
🛒 *Novo Pedido - Loja do Jane*

👤 *Cliente:* ${name}
📱 *Telefone:* ${phone}

📦 *Endereço:* 
${street}, ${number}
${complement ? complement + "\n" : ""}
${district} - ${city}/${uf}
CEP: ${cep}

📝 *Itens do Pedido:*
${cart
  .map(
    (item) =>
      `• ${item.name} — Quantidade: ${item.quantity} — R$ ${(item.price * item.quantity).toFixed(2)}`
  )
  .join("\n")}

💰 *Total:* R$ ${total.toFixed(2)}

Aguardando confirmação.`;

    const phoneNumber = "44988606483";
    const url = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.location.href = url;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-200 mb-4 inline-block"
      >
        ← Voltar para a loja
      </Link>

      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      {/* 🔥 RESUMO DO PEDIDO AGORA FICA EM CIMA */}
      <div className="bg-zinc-900 p-6 rounded-3xl shadow-lg shadow-emerald-500/10 mb-10">
        <h2 className="text-2xl font-semibold mb-4">Resumo do pedido</h2>

        {cart.length === 0 ? (
          <p className="text-zinc-400">Seu carrinho está vazio.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-zinc-800 pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-zinc-400">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-emerald-500 font-medium">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2 text-lg font-semibold">
              <p>Total</p>
              <p className="text-emerald-500">R$ {total.toFixed(2)}</p>
            </div>

            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-zinc-200 mt-2 inline-block"
            >
              ← Voltar para a loja
            </Link>
          </div>
        )}
      </div>

      {/* 🔻 FORMULÁRIO DE ENDEREÇO AGORA FICA EMBAIXO */}
      <h2 className="text-2xl font-semibold mb-2">Endereço</h2>
      <p className="text-zinc-400 mb-6 text-sm">
        Preencha seus dados para finalizar o pedido.
      </p>

      <form className="space-y-6">

        {/* CEP */}
        <div>
          <label className="block mb-1 text-sm">CEP *</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </div>

        {/* Rua */}
        <div>
          <label className="block mb-1 text-sm">Rua *</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>

        {/* Número + Complemento */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">Número *</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Complemento</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </div>
        </div>

        {/* Bairro */}
        <div>
          <label className="block mb-1 text-sm">Bairro *</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>

        {/* Cidade + UF */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block mb-1 text-sm">Cidade *</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">UF *</label>
            <input
              maxLength={2}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center uppercase"
              value={uf}
              onChange={(e) => setUf(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        {/* Botão */}
        <button
          type="button"
          onClick={handleFinish}
          className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-lg shadow-emerald-500/20 transition-all"
        >
          Finalizar pedido pelo WhatsApp
        </button>
      </form>
    </div>
  );
}