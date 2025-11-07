"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { priceBRL } from "@/lib/products";

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
};

export default function CheckoutPage() {
  const { items, remove, total, clear } = useCart();

  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
  });

  // Auto-preenche endereço quando CEP tem 8 dígitos
  useEffect(() => {
    const digits = (address.cep || "").replace(/\D/g, "");
    if (digits.length !== 8) return;

    const controller = new AbortController();

    (async () => {
      try {
        const resp = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
          signal: controller.signal,
        });
        const data = (await resp.json()) as {
          logradouro?: string;
          localidade?: string;
          uf?: string;
          erro?: boolean;
        };

        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro ?? prev.street,
            city: data.localidade ?? prev.city,
            state: data.uf ?? prev.state,
          }));
        }
      } catch {
        // ignore (usuário pode digitar outro CEP)
      }
    })();

    return () => controller.abort();
  }, [address.cep]);

  const handleChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui só mostramos os dados. Depois você integra pagamento/WhatsApp/PIX.
    alert(
      [
        "Pedido enviado! ✅",
        "",
        `Nome: ${address.name}`,
        `Telefone: ${address.phone}`,
        `CEP: ${address.cep}`,
        `Endereço: ${address.street}, ${address.number} (${address.complement})`,
        `Cidade/UF: ${address.city}/${address.state}`,
        "",
        `Itens:`,
        ...items.map(
          (it) =>
            `- ${it.product.title} x${it.quantity} = ${priceBRL(
              it.product.price * it.quantity
            )}`
        ),
        "",
        `Total: ${priceBRL(total())}`,
      ].join("\n")
    );
    clear();
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 text-white">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-xl font-semibold">
          Loja da Jane
        </Link>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700"
        >
          Voltar para a loja
        </Link>
      </header>

      <section className="bg-zinc-900/60 rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-semibold mb-4">Dados para entrega</h2>

        <form onSubmit={handleFinish} className="space-y-4">
          <input
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none"
            placeholder="Nome completo"
            value={address.name}
            onChange={handleChange("name")}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              placeholder="Telefone (WhatsApp)"
              value={address.phone}
              onChange={handleChange("phone")}
              required
            />
            <input
              className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              placeholder="CEP"
              value={address.cep}
              onChange={handleChange("cep")}
              inputMode="numeric"
              pattern="\d{5}-?\d{3}"
              required
            />
          </div>

          <input
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none"
            placeholder="Endereço"
            value={address.street}
            onChange={handleChange("street")}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              placeholder="Número"
              value={address.number}
              onChange={handleChange("number")}
              required
            />
            <input
              className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              placeholder="Complemento"
              value={address.complement}
              onChange={handleChange("complement")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              placeholder="Cidade"
              value={address.city}
              onChange={handleChange("city")}
              required
            />
            <input
              className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              placeholder="Estado"
              value={address.state}
              onChange={handleChange("state")}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 font-medium"
          >
            Finalizar pedido
          </button>

          <p className="text-sm text-zinc-400">
            Ao finalizar, os dados são mostrados e o carrinho limpa. Depois
            integramos pagamento/PIX/WhatsApp.
          </p>
        </form>
      </section>

      <section className="mt-8 bg-zinc-900/60 rounded-2xl p-6 shadow">
        <h3 className="text-xl font-semibold mb-4">Seu carrinho</h3>

        {items.length === 0 ? (
          <p className="text-zinc-400">Seu carrinho está vazio.</p>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.product.slug}
                className="flex items-center justify-between bg