// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../contexts/CartContext";

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  uf: string;
};

const INITIAL_ADDRESS: Address = {
  name: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  uf: "",
};

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

// número do WhatsApp da loja (não aparece nos campos do cliente)
const WHATSAPP_NUMBER = "44988606483";

export default function CheckoutPage() {
  const { items, total, removeItem, clearCart } = useCart();
  const hasItems = items.length > 0;

  const [address, setAddress] = useState<Address>(INITIAL_ADDRESS);
  const [isSending, setIsSending] = useState(false);

  const [showClearToast, setShowClearToast] = useState(false);

  // INPUTS DO FORM
  function handleChange(e: any) {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  }

  // BUSCA ENDEREÇO PELO CEP (ViaCEP)
  async function handleCepBlur() {
    const cepOnly = address.cep.replace(/\D/g, "");
    if (cepOnly.length !== 8) return;

    try {
      const res = await fetch(
        `https://viacep.com.br/ws/${cepOnly}/json/`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.erro) return;

      setAddress((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        district: data.bairro || prev.district,
        city: data.localidade || prev.city,
        uf: data.uf || prev.uf,
      }));
    } catch {
      // se der erro, só ignora
    }
  }

  // LIMPAR CARRINHO + TOAST
  function handleClearCart() {
    if (!hasItems) return;
    clearCart();
    setShowClearToast(true);
  }

  useEffect(() => {
    if (!showClearToast) return;
    const timer = setTimeout(
      () => setShowClearToast(false),
      3000
    );
    return () => clearTimeout(timer);
  }, [showClearToast]);

  // ENVIAR PEDIDO PRO WHATSAPP
  function handleSubmit(e: any) {
    e.preventDefault();
    if (!hasItems || isSending) return;

    setIsSending(true);

    const lines = items.map(
      (item) =>
        `• ${item.name} (Qtd: ${item.quantity}) - R$ ${brl(
          item.price
        )}`
    );

    const addressText = `
Nome: ${address.name}
Telefone: ${address.phone}
CEP: ${address.cep}
Rua: ${address.street}, Nº ${address.number}
Complemento: ${address.complement || "-"}
Bairro: ${address.district}
Cidade: ${address.city} - ${address.uf}
`.trim();

    const message = encodeURIComponent(
      `🛒 *Novo pedido da Loja do Jane*\n\n` +
        `*Itens:*\n${lines.join("\n")}\n\n` +
        `*Total:* R$ ${brl(total)}\n\n` +
        `*Endereço de entrega:*\n${addressText}`
    );

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank");
    setIsSending(false);
  }

  // SE ESTIVER VAZIO
  if (!hasItems) {
    return (
      <main className="min-h-screen bg-black text-white px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold mb-6">
            Carrinho
          </h1>

          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 text-center">
            <p className="mb-6 text-zinc-300">
              Seu carrinho está vazio.
            </p>

            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-semibold">Carrinho</h1>

        {/* LISTA DE ITENS */}
        <section className="space-y-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center gap-4 rounded-3xl bg-zinc-900 border border-zinc-800 p-4"
            >
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold">
                  {item.name}
                </p>
                <p className="text-xs text-zinc-400">
                  Qtd: {item.quantity} • R$ {brl(item.price)}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.slug)}
                className="rounded-2xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white"
              >
                Remover
              </button>
            </div>
          ))}
        </section>

        {/* TOTAL + AÇÕES */}
        <section className="space-y-4 rounded-3xl bg-zinc-900 border border-zinc-800 p-5">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="text-emerald-400">
              R$ {brl(total)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            className="w-full rounded-3xl border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-200"
          >
            Limpar carrinho
          </button>

          <button
            type="submit"
            form="checkout-form"
            disabled={isSending}
            className="w-full rounded-3xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSending
              ? "Abrindo WhatsApp..."
              : "Finalizar compra no WhatsApp"}
          </button>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-3xl border border-emerald-500/40 px-4 py-3 text-sm font-medium text-emerald-400"
          >
            Voltar para a loja
          </Link>
        </section>

        {/* FORM DE ENDEREÇO */}
        <section className="rounded-3xl bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <h2 className="text-xl font-semibold mb-2">
            Endereço
          </h2>

          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm text-zinc-300">
                Nome *
              </label>
              <input
                name="name"
                value={address.name}
                onChange={handleChange}
                className="w-full rounded-3xl bg-black px-4 py-3 text-sm outline-none border border-zinc-700"
                placeholder="Nome completo"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-300">
                Telefone / WhatsApp *
              </label>
              <input
                name="phone"
                value={address.phone}
                onChange={handleChange}
                className="w-full rounded-3xl bg-black px-4 py-3 text-sm outline-none border border-zinc-700"
                placeholder="(44) 9 9999-9999"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-300">
                CEP *
              </label>
              <input
                name="cep"
                value={address.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                className="w-full rounded-3xl bg-black px-4 py-3 text-sm outline-none border border-zinc-700"
                placeholder="87000-000"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-300">
                Rua *
              </label>
              <input
                name="street"
                value={address.street}
                onChange={handleChange}
                className="w-full rounded-3xl bg-black px-4 py-3 text-sm outline-none border border-zinc-700"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Número *
                </label>
                <input
                  name="number"
                  value={address.number}
                  onChange={handleChange}
                  className="w-full rounded-3xl bg-black px-4 py-3 text-sm outline-none border border-zinc-700"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Complemento
                </label>
                <input
                  name="complement"
                  value={address.complement}
                  onChange={handleChange}
                  className="w-full rounded-3xl bg-black px-4 py-3 text-sm outline-none border border-zinc-700"
                  placeholder="Apto, bloco, referência..."
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-zinc-300">
                Bairro *
              </label>
              <input
                name="district"
                value={address.district}
                onChange={handleChange}
                className="w-full rounded-3xl bg-black px-4 py-3 text-sm outline-none border border-zinc-700"
                required
              />
            </div>

            <div className="grid grid-cols-[2fr,1fr] gap-3">
              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Cidade *
                </label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  className="w-full rounded-3xl bg-black px-4 py-3 text-sm outline-none border border-zinc-700"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  UF *
                </label>
                <input
                  name="uf"
                  value={address.uf}
                  onChange={handleChange}
                  className="w-full rounded-3xl bg-black px-4 py-3 text-sm outline-none border border-zinc-700"
                  placeholder="PR"
                  maxLength={2}
                  required
                />
              </div>
            </div>
          </form>
        </section>
      </div>

      {/* TOAST - CARRINHO LIMPO */}
      {showClearToast && (
        <div className="fixed bottom-6 left-1/2 z-[9999] w-[92%] max-w-md -translate-x-1/2 pointer-events-none">
          <div className="pointer-events-auto flex gap-3 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 shadow-xl shadow-emerald-900/40">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/30">
              <span className="text-lg font-semibold text-emerald-50">
                ✓
              </span>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-50">
                Carrinho limpo
              </p>
              <p className="text-xs text-emerald-50/80">
                Todos os itens foram removidos do seu carrinho.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}