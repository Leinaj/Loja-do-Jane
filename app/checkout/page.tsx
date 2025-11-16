// app/checkout/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

type CepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateUF, setStateUF] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleCepBlur() {
    const cepNumbers = cep.replace(/\D/g, "");
    if (cepNumbers.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
      const data: CepResponse = await res.json();

      if (!data.erro) {
        setStreet(data.logradouro ?? "");
        setNeighborhood(data.bairro ?? "");
        setCity(data.localidade ?? "");
        setStateUF(data.uf ?? "");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    setIsSubmitting(true);

    // aqui seria onde você enviaria para um backend / WhatsApp / etc
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      clearCart();
    }, 800);
  }

  // Se o carrinho estiver vazio
  if (cart.length === 0 && !success) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-4">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            ← Voltar para a loja
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center">
          <p className="text-lg mb-2">Seu carrinho está vazio.</p>
          <p className="text-sm text-zinc-400 mb-4">
            Adicione alguns produtos para finalizar o pedido.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 text-black px-6 py-2 font-medium hover:bg-emerald-400 transition-colors"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          ← Voltar para a loja
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-2">Endereço</h1>
      <p className="text-sm text-zinc-400 mb-6">
        Preencha seus dados para finalizar o pedido.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
        {/* RESUMO DO PEDIDO */}
        <aside className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Resumo do pedido</h2>

          {cart.length === 0 ? (
            <p className="text-sm text-zinc-400">Seu carrinho está vazio.</p>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.slug}
                    className="flex items-center gap-3 rounded-2xl bg-black/40 border border-zinc-800 px-3 py-2"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-zinc-400">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-emerald-400">
                      R$ {(item.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-zinc-800 pt-4 flex items-center justify-between">
                <span className="text-sm">Total</span>
                <span className="text-xl font-semibold text-emerald-400">
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </>
          )}

          <Link
            href="/"
            className="mt-2 text-sm text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            ← Voltar para a loja
          </Link>
        </aside>

        {/* FORMULÁRIO */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm mb-1">Nome completo *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-black border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Telefone / WhatsApp *</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl bg-black border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">CEP *</label>
            <input
              required
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={handleCepBlur}
              className="w-full rounded-xl bg-black border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Rua *</label>
            <input
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full rounded-xl bg-black border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-[1.1fr_1.4fr] gap-4">
            <div>
              <label className="block text-sm mb-1">Número *</label>
              <input
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full rounded-xl bg-black border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Complemento</label>
              <input
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Apto, bloco, referência..."
                className="w-full rounded-xl bg-black border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Bairro *</label>
            <input
              required
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full rounded-xl bg-black border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-[2fr_0.6fr] gap-4">
            <div>
              <label className="block text-sm mb-1">Cidade *</label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl bg-black border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">UF *</label>
              <input
                required
                value={stateUF}
                onChange={(e) => setStateUF(e.target.value.toUpperCase())}
                maxLength={2}
                className="w-full rounded-xl bg-black border border-zinc-800 px-3 py-2 text-sm outline-none focus:border-emerald-500 text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-emerald-500 text-black font-semibold py-3 shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:bg-emerald-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Finalizando..." : "Finalizar pedido"}
          </button>

          {success && (
            <p className="text-sm text-emerald-400 mt-2">
              Pedido enviado! 🎉 Em breve entraremos em contato.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}