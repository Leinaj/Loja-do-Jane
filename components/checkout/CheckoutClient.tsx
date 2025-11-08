"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useState } from "react";

export default function CheckoutClient() {
  const { items, remove, clear, total } = useCart();

  // formulário (mínimo funcional; seu auto-CEP continua funcionando se já estava no projeto)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    city: "",
    state: "",
  });

  return (
    <div className="py-8">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Checkout</h1>

      <div className="grid gap-6 md:grid-cols-[1.2fr_.8fr]">
        {/* Coluna do carrinho */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <h2 className="mb-4 text-xl font-semibold">Carrinho</h2>

          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="rounded-xl border border-white/10 p-6 text-center text-zinc-400">
                Seu carrinho está vazio. <Link href="/" className="text-emerald-300 underline">Continuar comprando</Link>
              </div>
            ) : (
              items.map((it) => (
                <div key={`${it.id}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg ring-1 ring-white/10">
                    <Image src={it.image} alt={it.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{it.name}</div>
                    <div className="mt-0.5 text-xs text-zinc-400">
                      {it.quantity} × R$ {it.price.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(String(it.id))}
                    className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-500/25"
                  >
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-zinc-300">
              Total: <span className="font-semibold text-emerald-400">R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            <button
              onClick={clear}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
            >
              Limpar carrinho
            </button>
          </div>
        </section>

        {/* Coluna do endereço/pagamento */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <h2 className="mb-4 text-xl font-semibold">Endereço</h2>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Pedido enviado! (aqui você integra pagamento)");
            }}
          >
            <Input label="Nome *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Telefone *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Input label="CEP *" value={form.cep} onChange={(v) => setForm({ ...