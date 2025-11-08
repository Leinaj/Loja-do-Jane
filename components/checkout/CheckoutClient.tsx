"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/toast";

export default function CheckoutClient() {
  const { items, remove, clear, total } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    city: "",
    state: "",
  });

  // formatação do CEP e busca ViaCEP
  const cepDigits = useMemo(() => form.cep.replace(/\D/g, "").slice(0, 8), [form.cep]);
  const cepMasked = useMemo(
    () => (cepDigits.length > 5 ? `${cepDigits.slice(0, 5)}-${cepDigits.slice(5)}` : cepDigits),
    [cepDigits]
  );

  useEffect(() => {
    if (cepDigits.length === 8) {
      (async () => {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
          const data = (await res.json()) as any;
          if (!data.erro) {
            setForm((f) => ({
              ...f,
              street: data.logradouro ?? f.street,
              city: data.localidade ?? f.city,
              state: data.uf ?? f.state,
            }));
            toast({
              title: "Endereço preenchido!",
              description: "Encontramos seu endereço pelo CEP.",
              variant: "success",
              durationMs: 2200,
            });
          }
        } catch {
          // falhou silenciosamente
        }
      })();
    }
  }, [cepDigits]);

  return (
    <div className="py-8">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Checkout</h1>

      <div className="grid gap-6 md:grid-cols-[1.2fr_.8fr]">
        {/* Carrinho */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <h2 className="mb-4 text-xl font-semibold">Carrinho</h2>

          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="rounded-xl border border-white/10 p-6 text-center text-zinc-400">
                Seu carrinho está vazio.{" "}
                <Link href="/" className="text-emerald-300 underline">
                  Continuar comprando
                </Link>
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

        {/* Endereço */}
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

            <Input
              label="CEP *"
              value={cepMasked}
              onChange={(v) => setForm({ ...form, cep: v })}
              helper={cepDigits.length === 8 ? "Buscando endereço..." : "Somente números"}
            />

            <Input label="Rua *" value={form.street} onChange={(v) => setForm({ ...form, street: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Número *" value={form.number} onChange={(v) => setForm({ ...form, number: v })} />
              <Input label="Cidade *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            </div>
            <Input label="Estado *" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
              >
                Finalizar pedido
              </button>
              <Link
                href="/"
                className="mt-3 block w-full rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-emerald-300 hover:bg-white/5"
              >
                Voltar para a loja
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-300">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0b1512] px-3 py-3 text-sm outline-none ring-emerald-400/30 placeholder:text-zinc-500 focus:ring-2"
        placeholder=""
      />
      {helper && <span className="mt-1 block text-xs text-zinc-500">{helper}</span>}
    </label>
  );
}