// app/checkout/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../contexts/CartContext"; // <- CAMINHO CERTO

type Address = {
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

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function CheckoutPage() {
  const { items, total, removeItem, clearCart } = useCart();
  const hasItems = items.length > 0;

  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",          // <- sem seu número
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    uf: "",
  });

  function handleChange<K extends keyof Address>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleCepBlur() {
    const cep = address.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          uf: data.uf || "",
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP", err);
    }
  }

  function handleSendWhatsApp() {
    if (!hasItems) return;

    // número que vai receber o pedido (pode trocar aqui depois)
    const storePhone = "5544988606483";

    const lines: string[] = [
      "🛒 *Novo pedido - Loja da Jane*",
      "",
      "*Itens:*",
      ...items.map(
        (item) =>
          `• ${item.quantity ?? 1}x ${item.name} - R$ ${brl(item.price)}`
      ),
      "",
      `*Total:* R$ ${brl(total)}`,
      "",
      "*Dados do cliente:*",
      `Nome: ${address.name || "-"} `,
      `WhatsApp: ${address.phone || "-"} `,
      `CEP: ${address.cep || "-"} `,
      `Rua: ${address.street || "-"}, nº ${address.number || "-"}`,
      `Bairro: ${address.neighborhood || "-"}`,
      `Cidade/UF: ${address.city || "-"} - ${address.uf || "-"}`,
    ];

    if (address.complement) {
      lines.push(`Complemento: ${address.complement}`);
    }

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${storePhone}?text=${text}`;

    window.open(url, "_blank");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 pb-24">
        <h1 className="text-3xl font-bold mb-2">Carrinho</h1>

        {/* Carrinho vazio */}
        {!hasItems && (
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 text-center">
            <p className="mb-6 text-lg text-zinc-200">
              Seu carrinho está vazio.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white"
            >
              Voltar para a loja
            </Link>
          </div>
        )}

        {/* Carrinho com itens */}
        {hasItems && (
          <>
            <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-4 sm:p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className="flex items-center gap-4 rounded-3xl bg-black/40 p-3"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base">
                        {item.name}
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Qtd: {item.quantity ?? 1} • R$ {brl(item.price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className="rounded-2xl bg-pink-500 px-4 py-2 text-xs sm:text-sm font-medium text-white"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-emerald-400">
                  R$ {brl(total)}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-sm font-medium text-zinc-200"
                >
                  Limpar carrinho
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  Finalizar compra no WhatsApp
                </button>

                <Link
                  href="/"
                  className="w-full rounded-2xl border border-emerald-500/60 bg-black px-4 py-3 text-center text-sm font-medium text-emerald-400"
                >
                  Voltar para a loja
                </Link>
              </div>
            </div>

            {/* Formulário de endereço */}
            <section className="rounded-3xl bg-zinc-900 border border-zinc-800 p-4 sm:p-6 flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-2">Endereço</h2>

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
                onBlur={handleCepBlur}
              />

              <input
                className="w-full rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                placeholder="Rua *"
                value={address.street}
                onChange={handleChange("street")}
              />

              <div className="flex gap-3">
                <input
                  className="w-1/2 rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                  placeholder="Número *"
                  value={address.number}
                  onChange={handleChange("number")}
                />
                <input
                  className="w-1/2 rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                  placeholder="Complemento"
                  value={address.complement}
                  onChange={handleChange("complement")}
                />
              </div>

              <input
                className="w-full rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                placeholder="Bairro *"
                value={address.neighborhood}
                onChange={handleChange("neighborhood")}
              />

              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                  placeholder="Cidade *"
                  value={address.city}
                  onChange={handleChange("city")}
                />
                <input
                  className="w-20 rounded-2xl bg-black border border-zinc-700 px-4 py-3 text-sm"
                  placeholder="UF *"
                  value={address.uf}
                  onChange={handleChange("uf")}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}