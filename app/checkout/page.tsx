"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, clearCart, total } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  // Buscar endereço pelo CEP
  const handleCepBlur = async () => {
    if (cep.length < 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setStreet(data.logradouro || "");
        setDistrict(data.bairro || "");
        setCity(data.localidade || "");
        setUf(data.uf || "");
      }
    } catch (error) {
      console.log("Erro ao buscar CEP:", error);
    }
  };

  const finalizeWhatsApp = () => {
    const msg =
      `🔥 *Novo Pedido Loja do Jane*\n\n` +
      `👤 *Cliente:* ${name}\n` +
      `📱 *Telefone:* ${phone}\n\n` +
      `📦 *Itens:* \n` +
      cart.map((item) => `• ${item.name} — ${item.quantity}x`).join("\n") +
      `\n\n💰 *Total:* R$ ${total.toFixed(2)}\n\n` +
      `📍 *Endereço:* \n` +
      `${street}, ${number}\n` +
      `${district} - ${city} / ${uf}\n` +
      `Complemento: ${complement}\n` +
      `CEP: ${cep}`;

    const url = `https://wa.me/5544988606483?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* ======================= */}
      {/* RESUMO DO PEDIDO PRIMEIRO */}
      {/* ======================= */}
      <div className="bg-black/30 p-4 rounded-xl border border-white/10 backdrop-blur mb-8">
        <h2 className="text-xl font-semibold mb-4">Resumo do pedido</h2>

        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                className="w-12 h-12 object-cover rounded-full"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">Quantidade: {item.quantity}</p>
              </div>
            </div>
            <span className="text-green-400 font-semibold">
              R$ {item.price.toFixed(2)}
            </span>
          </div>
        ))}

        <hr className="border-white/10 my-3" />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-green-400">R$ {total.toFixed(2)}</span>
        </div>

        <Link href="/" className="text-sm text-gray-300 mt-3 block underline">
          ← Voltar para a loja
        </Link>
      </div>

      {/* ======================= */}
      {/* CAMPOS DE ENDEREÇO DEPOIS */}
      {/* ======================= */}

      <h2 className="text-xl font-semibold mb-3">
        Preencha seus dados para finalizar o pedido
      </h2>

      <div className="bg-black/30 p-4 rounded-xl border border-white/10 backdrop-blur">
        <div className="flex flex-col gap-4">

          <input
            className="bg-black/30 p-3 rounded-xl border border-white/10"
            placeholder="Nome completo *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="bg-black/30 p-3 rounded-xl border border-white/10"
            placeholder="Telefone / WhatsApp *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="bg-black/30 p-3 rounded-xl border border-white/10"
            placeholder="CEP *"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onBlur={handleCepBlur}
          />

          <input
            className="bg-black/30 p-3 rounded-xl border border-white/10"
            placeholder="Rua *"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />

          <div className="flex gap-4">
            <input
              className="bg-black/30 p-3 rounded-xl border border-white/10 w-1/2"
              placeholder="Número *"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              className="bg-black/30 p-3 rounded-xl border border-white/10 w-1/2"
              placeholder="Complemento"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
            />
          </div>

          <input
            className="bg-black/30 p-3 rounded-xl border border-white/10"
            placeholder="Bairro *"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />

          <div className="flex gap-4">
            <input
              className="bg-black/30 p-3 rounded-xl border border-white/10 w-2/3"
              placeholder="Cidade *"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="bg-black/30 p-3 rounded-xl border border-white/10 w-1/3"
              placeholder="UF *"
              maxLength={2}
              value={uf}
              onChange={(e) => setUf(e.target.value.toUpperCase())}
            />
          </div>

          <button
            onClick={finalizeWhatsApp}
            className="mt-4 bg-green-600 hover:bg-green-500 text-black font-semibold p-4 rounded-full shadow-lg shadow-green-500/40 transition"
          >
            Finalizar pedido pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}