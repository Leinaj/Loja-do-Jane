// app/checkout/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function CheckoutPage() {
  const { items, total, removeItem, clear } = useCart();

  const hasItems = items.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-4">Carrinho</h1>

      {!hasItems && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center space-y-4">
          <p className="text-zinc-300">Seu carrinho está vazio.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 text-white px-6 py-3 font-medium"
          >
            Voltar para a loja
          </Link>
        </div>
      )}

      {hasItems && (
        <>
          {/* lista de itens */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-3xl bg-zinc-900 border border-zinc-800 p-4"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-zinc-800">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-zinc-400">
                    R$ {brl(item.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded-2xl bg-pink-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          {/* total + ações */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg text-zinc-200">Total:</span>
              <span className="text-2xl font-semibold text-emerald-400">
                R$ {brl(total)}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={clear}
                className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200"
              >
                Limpar carrinho
              </button>

              <a
                href="https://wa.me/5544988606483"
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[180px] inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Finalizar compra no WhatsApp
              </a>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-500 text-emerald-400 px-4 py-2.5 text-sm font-semibold"
              >
                Voltar para a loja
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}