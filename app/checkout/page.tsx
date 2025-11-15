"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useState, ChangeEvent } from "react";

type AddressFormState = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
};

export default function CheckoutPage() {
  const { items, total, removeItem, clear } = useCart();

  const hasItems = items.length > 0;

  const [address, setAddress] = useState<AddressFormState>({
    name: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    uf: "",
  });

  const [loadingCep, setLoadingCep] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCepBlur() {
    const raw = address.cep.replace(/\D/g, "");
    if (raw.length !== 8) return;

    try {
      setLoadingCep(true);
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();
      if (data.erro) return;

      setAddress((prev) => ({
        ...prev,
        street: data.logradouro ?? prev.street,
        neighborhood: data.bairro ?? prev.neighborhood,
        city: data.localidade ?? prev.city,
        uf: data.uf ?? prev.uf,
      }));
    } catch {
      // se der erro, só ignora
    } finally {
      setLoadingCep(false);
    }
  }

  function handleFinishOnWhatsApp() {
    if (!hasItems) return;

    const lines: string[] = [];

    lines.push("🛒 *Novo pedido Loja da Jane*");
    lines.push("");
    lines.push("*Itens:*");

    for (const item of items) {
      lines.push(
        `• ${item.product.name} - Qtd: ${item.qty} - R$ ${item.product.price
          .toFixed(2)
          .replace(".", ",")}`
      );
    }

    lines.push("");
    lines.push(
      `*Total:* R$ ${total.toFixed(2).replace(".", ",")}`
    );
    lines.push("");
    lines.push("*Endereço de entrega:*");
    lines.push(`Nome: ${address.name || "-"} `);
    lines.push(`Telefone: ${address.phone || "-"} `);
    lines.push(
      `Endereço: ${address.street || "-"}, ${address.number || "-"} ${
        address.complement || ""
      }`
    );
    lines.push(
      `Bairro: ${address.neighborhood || "-"} - ${address.city || "-"} / ${
        address.uf || "-"
      }`
    );
    lines.push(`CEP: ${address.cep || "-"}`);

    const text = encodeURIComponent(lines.join("\n"));

    // coloca aqui o seu número de WhatsApp com DDI/DD
    const phoneNumber = "5544988660483"; // altere se quiser

    const url = `https://wa.me/${phoneNumber}?text=${text}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 pb-16 pt-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold mb-2">Carrinho</h1>

        {/* LISTA DE ITENS */}
        {!hasItems && (
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 text-center">
            <p className="text-lg mb-6">Seu carrinho está vazio.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 font-medium text-white"
            >
              Voltar para a loja
            </Link>
          </div>
        )}

        {hasItems && (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.slug} // <- CORRIGIDO AQUI
                  className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex gap-4 items-center"
                >
                  <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-zinc-800">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold">{item.product.name}</div>
                    <div className="text-sm text-zinc-400">
                      Qtd: {item.qty} • R${" "}
                      {item.product.price
                        .toFixed(2)
                        .replace(".", ",")}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product.slug)}
                    className="rounded-full bg-pink-500/90 hover:bg-pink-500 px-4 py-2 text-sm font-medium"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL + AÇÕES */}
            <div className="mt-6 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-2xl font-bold text-emerald-400">
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
                >
                  Limpar carrinho
                </button>

                <button
                  type="button"
                  onClick={handleFinishOnWhatsApp}
                  className="rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                  Finalizar compra no WhatsApp
                </button>

                <Link
                  href="/"
                  className="rounded-full border border-emerald-500/60 px-4 py-3 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 text-center"
                >
                  Voltar para a loja
                </Link>
              </div>
            </div>

            {/* FORMULÁRIO DE ENDEREÇO COM GLOW */}
            <section className="mt-8 rounded-3xl bg-zinc-900/80 border border-emerald-500/20 p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
              <h2 className="text-xl font-semibold mb-4">Endereço</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">
                    Nome *
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                    <input
                      name="name"
                      value={address.name}
                      onChange={handleChange}
                      className="relative w-full rounded-2xl bg-black/60 border border-emerald-500/30 px-4 py-3 outline-none text-sm placeholder:text-zinc-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] focus:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow"
                      placeholder="Nome completo"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                    <input
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      className="relative w-full rounded-2xl bg-black/60 border border-emerald-500/30 px-4 py-3 outline-none text-sm placeholder:text-zinc-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] focus:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow"
                      placeholder="(44) 9 9999-9999"
                    />
                  </div>
                </div>

                {/* CEP */}
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">
                    CEP *
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                    <input
                      name="cep"
                      value={address.cep}
                      onChange={handleChange}
                      onBlur={handleCepBlur}
                      className="relative w-full rounded-2xl bg-black/60 border border-emerald-500/30 px-4 py-3 outline-none text-sm placeholder:text-zinc-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] focus:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow"
                      placeholder="87000-000"
                    />
                    {loadingCep && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-emerald-400">
                        Buscando CEP...
                      </span>
                    )}
                  </div>
                </div>

                {/* Rua */}
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">
                    Rua *
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                    <input
                      name="street"
                      value={address.street}
                      onChange={handleChange}
                      className="relative w-full rounded-2xl bg-black/60 border border-emerald-500/30 px-4 py-3 outline-none text-sm placeholder:text-zinc-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] focus:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow"
                      placeholder="Rua *"
                    />
                  </div>
                </div>

                {/* Número + Complemento */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-zinc-300 mb-1">
                      Número *
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                      <input
                        name="number"
                        value={address.number}
                        onChange={handleChange}
                        className="relative w-full rounded-2xl bg-black/60 border border-emerald-500/30 px-4 py-3 outline-none text-sm placeholder:text-zinc-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] focus:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow"
                        placeholder="Número"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-300 mb-1">
                      Complemento
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                      <input
                        name="complement"
                        value={address.complement}
                        onChange={handleChange}
                        className="relative w-full rounded-2xl bg-black/60 border border-emerald-500/30 px-4 py-3 outline-none text-sm placeholder:text-zinc-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] focus:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow"
                        placeholder="Apto, bloco, referência..."
                      />
                    </div>
                  </div>
                </div>

                {/* Bairro */}
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">
                    Bairro *
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                    <input
                      name="neighborhood"
                      value={address.neighborhood}
                      onChange={handleChange}
                      className="relative w-full rounded-2xl bg-black/60 border border-emerald-500/30 px-4 py-3 outline-none text-sm placeholder:text-zinc-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] focus:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow"
                      placeholder="Bairro *"
                    />
                  </div>
                </div>

                {/* Cidade + UF */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm text-zinc-300 mb-1">
                      Cidade *
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                      <input
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        className="relative w-full rounded-2xl bg-black/60 border border-emerald-500/30 px-4 py-3 outline-none text-sm placeholder:text-zinc-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] focus:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow"
                        placeholder="Cidade *"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-300 mb-1">
                      UF *
                    </label>
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
                      <input
                        name="uf"
                        value={address.uf}
                        onChange={handleChange}
                        className="relative w-full rounded-2xl bg-black/60 border border-emerald-500/30 px-4 py-3 outline-none text-sm placeholder:text-zinc-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)] focus:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-shadow"
                        placeholder="PR"
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}