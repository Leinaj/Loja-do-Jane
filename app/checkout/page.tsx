// app/checkout/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function CheckoutPage() {
  const { items, total, removeItem, clearCart } = useCart();

  const hasItems = items.length > 0;

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
                  Qtd: {item.quantity} &nbsp;•&nbsp; R$ {brl(item.price)}
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

        {/* RESUMO E AÇÕES */}
        <section className="space-y-4">
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
              href={`https://wa.me/5544988606483?text=${encodeURIComponent(
                `Olá, gostaria de finalizar a compra na Loja da Jane.\n\nItens:\n${items
                  .map(
                    (i) =>
                      `• ${i.name} (Qtd: ${i.quantity}) - R$ ${brl(i.price)}`
                  )
                  .join("\n")}\n\nTotal: R$ ${brl(total)}`
              )}`}
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
        </section>
      </div>
    </main>
  );
}