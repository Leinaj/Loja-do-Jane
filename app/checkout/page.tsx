"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";

type Address = {
  name: string;
  phone?: string;
  zip?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
};

const money = (n: number) =>
  (n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function CheckoutPage() {
  const { items, remove, clear } = useCart();
  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    zip: "",
    street: "",
    number: "",
    city: "",
    state: "",
  });

  // total calculado localmente (não depende de função externa)
  const total = useMemo(() => {
    return items.reduce((acc, it: any) => acc + (it?.price ?? 0) * (it?.quantity ?? 1), 0);
  }, [items]);

  const disabled = items.length === 0 || !address.name?.trim();

  const handlePlaceOrder = () => {
    if (disabled) return;

    const msg =
      `🧾 *Pedido recebido!*\n` +
      `*Cliente:* ${address.name}\n` +
      (address.phone ? `*Tel:* ${address.phone}\n` : "") +
      `*Total:* ${money(total)}\n` +
      `*Entrega:* ${[
        address.street,
        address.number,
        address.city,
        address.state,
        address.zip,
      ]
        .filter(Boolean)
        .join(", ")}\n\n` +
      `*Itens:*\n` +
      items
        .map(
          (it: any) =>
            `• ${it.name ?? it.title} — ${it.quantity} × ${money(it.price)}`
        )
        .join("\n");

    // abre WhatsApp com mensagem pronta
    const phone = "5544988606483"; // <<< ajuste se quiser outro número
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    // limpa carrinho depois de abrir o WhatsApp
    clear();
  };

  // preenche cidade/UF a partir do CEP? (opcional, só mantém campos)
  useEffect(() => {
    // espaço para futuras integrações
  }, [address.zip]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Loja da Jane
          </Link>
          <span className="text-sm text-neutral-400">
            {items.length} item(ns) — <strong className="text-white">{money(total)}</strong>
          </span>
        </div>
      </header>

      <main className="container grid gap-8 py-8 lg:grid-cols-3">
        {/* formulário */}
        <section className="card p-5 lg:col-span-2">
          <h1 className="mb-4 text-xl font-bold">Dados para entrega</h1>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-neutral-300">Nome completo*</label>
              <input
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
                placeholder="Digite seu nome"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-neutral-300">Telefone (WhatsApp)</label>
              <input
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
                placeholder="(44) 9 8888-8888"
                inputMode="tel"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-neutral-300">CEP</label>
              <input
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
                placeholder="87000-000"
                inputMode="numeric"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-neutral-300">Endereço</label>
              <input
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
                placeholder="Rua / Avenida"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-neutral-300">Número</label>
              <input
                value={address.number}
                onChange={(e) => setAddress({ ...address, number: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
                placeholder="123"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-neutral-300">Cidade</label>
              <input
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
                placeholder="Maringá"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-neutral-300">Estado (UF)</label>
              <input
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none"
                placeholder="PR"
                maxLength={2}
              />
            </div>
          </div>
        </section>

        {/* resumo */}
        <aside className="card p-5">
          <h2 className="mb-4 text-lg font-semibold">Resumo do pedido</h2>

          <div className="mb-4 space-y-3">
            {items.length === 0 && (
              <p className="text-neutral-400">Seu carrinho está vazio.</p>
            )}

            {items.map((it: any) => (
              <div
                key={`${it.id ?? it.slug}-${it.size ?? ""}`}
                className="flex items-start justify-between rounded-xl border border-white/10 p-3"
              >
                <div>
                  <p className="font-medium">{it.name ?? it.title}</p>
                  <p className="text-sm text-neutral-400">
                    {it.quantity} × {money(it.price)}
                  </p>
                </div>
                <button
                  onClick={() => remove(it)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="mb-4 border-t border-white/10 pt-3">
            <div className="flex justify-between text-neutral-300">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Entrega</span>
              <span>Combinar pelo WhatsApp</span>
            </div>
            <div className="mt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={disabled}
            className={`btn w-full ${disabled ? "opacity-60" : ""}`}
          >
            Finalizar pedido no WhatsApp
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            Ao clicar, abriremos o WhatsApp com o pedido preenchido.
          </p>
        </aside>
      </main>
    </>
  );
}