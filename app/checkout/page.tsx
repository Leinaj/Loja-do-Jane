// app/checkout/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
};

export default function CheckoutPage() {
  const { items, total, removeItem, clearCart } = useCart();

  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "44988606483", // seu número já vem preenchido
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: ""
  });

  const hasItems = items.length > 0;

  // Atualiza campos do endereço
  function handleChange(field: keyof Address) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  // Buscar endereço pelo CEP (via ViaCEP)
  useEffect(() => {
    const cepNumbers = address.cep.replace(/\D/g, "");

    if (cepNumbers.length === 8) {
      (async () => {
        try {
          const res = await fetch(
            `https://viacep.com.br/ws/${cepNumbers}/json/`
          );
          const data = await res.json();

          if (!data.erro) {
            setAddress((prev) => ({
              ...prev,
              street: data.logradouro ?? prev.street,
              district: data.bairro ?? prev.district,
              city: data.localidade ?? prev.city,
              state: data.uf ?? prev.state
            }));
          }
        } catch (err) {
          console.error("Erro ao buscar CEP", err);
        }
      })();
    }
  }, [address.cep]);

  // Mensagem pra mandar no WhatsApp
  const whatsappMessage = (() => {
    const itemsText = items
      .map(
        (i) =>
          `• ${i.name} (Qtd: ${i.quantity}) - R$ ${brl(i.price)}`
      )
      .join("\n");

    const addressText = `
Dados para entrega:
Nome: ${address.name || "-"}
Telefone: ${address.phone || "-"}
CEP: ${address.cep || "-"}
Endereço: ${address.street || "-"}, ${address.number || "-"} ${
      address.complement || ""
    }
Bairro: ${address.district || "-"}
Cidade/UF: ${address.city || "-"} - ${address.state || "-"}`.trim();

    return (
      `Olá, gostaria de finalizar a compra na Loja da Jane.\n\n` +
      `Itens:\n${itemsText}\n\n` +
      `Total: R$ ${brl(total)}\n\n` +
      addressText
    );
  })();

  const whatsappLink = `https://wa.me/5544988606483?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // CARRINHO VAZIO
  if (!hasItems) {
    return (
      <main className="min-h-screen bg-black text-white px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Carrinho</h1>

        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 text-center max-w-xl mx-auto">
          <p className="mb-6 text-lg text-zinc-300">
            Seu carrinho está vazio.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 font-medium text-white"
          >
            Voltar para a loja
          </Link>
        </div>
      </main>
    );
  }

  // CARRINHO COM ITENS + FORM
  return (
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Carrinho</h1>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        {/* LISTA DE ITENS */}
        <section className="space-y-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center gap-4 rounded-3xl bg-zinc-900 border border-zinc-800 p-4"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-zinc-400">
                  Qtd: {item.quantity} • R$ {brl(item.price)}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.slug)}
                className="rounded-full bg-pink-600 px-4 py-2 text-sm font-medium"
              >
                Remover
              </button>
            </div>
          ))}
        </section>

        {/* RESUMO + FORM + AÇÕES */}
        <section className="space-y-4">
          {/* RESUMO */}
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg">Total:</span>
              <span className="text-2xl font-semibold text-emerald-400">
                R$ {brl(total)}
              </span>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="w-full mb-3 rounded-full border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-200"
            >
              Limpar carrinho
            </button>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white mb-3"
            >
              Finalizar compra no WhatsApp
            </a>

            <Link
              href="/"
              className="block w-full rounded-full border border-emerald-500 px-4 py-3 text-center text-sm font-medium text-emerald-400"
            >
              Voltar para a loja
            </Link>
          </div>

          {/* FORMULÁRIO DE ENDEREÇO */}
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Endereço</h2>

            <div className="space-y-3">
              <input
                className="w-full rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                placeholder="Nome *"
                value={address.name}
                onChange={handleChange("name")}
              />

              <input
                className="w-full rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                placeholder="WhatsApp *"
                value={address.phone}
                onChange={handleChange("phone")}
              />

              <input
                className="w-full rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                placeholder="CEP *"
                value={address.cep}
                onChange={handleChange("cep")}
              />

              <input
                className="w-full rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                placeholder="Rua *"
                value={address.street}
                onChange={handleChange("street")}
              />

              <div className="flex gap-3">
                <input
                  className="w-1/3 rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                  placeholder="Número *"
                  value={address.number}
                  onChange={handleChange("number")}
                />
                <input
                  className="flex-1 rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                  placeholder="Complemento"
                  value={address.complement}
                  onChange={handleChange("complement")}
                />
              </div>

              <input
                className="w-full rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                placeholder="Bairro *"
                value={address.district}
                onChange={handleChange("district")}
              />

              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                  placeholder="Cidade *"
                  value={address.city}
                  onChange={handleChange("city")}
                />
                <input
                  className="w-24 rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                  placeholder="UF *"
                  value={address.state}
                  onChange={handleChange("state")}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}