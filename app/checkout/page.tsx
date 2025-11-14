"use client";

import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, total, removeItem, clear } = useCart();

  const hasItems = items.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Carrinho</h1>

      {!hasItems && (
        <p className="text-neutral-400">Seu carrinho está vazio.</p>
      )}

      {hasItems && (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex gap-4 items-center"
            >
              <div className="w-20 h-20 relative rounded-xl overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex-1">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-neutral-400">
                  {item.quantity}x — R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.slug)}
                className="text-red-400 hover:text-red-300"
              >
                Remover
              </button>
            </div>
          ))}

          <div className="text-right text-2xl font-semibold mt-6">
            Total: R$ {total.toFixed(2).replace(".", ",")}
          </div>

          <button
            onClick={() =>
              window.open(
                `https://wa.me/5544988606483?text=Olá! Quero finalizar meu pedido. Total: R$ ${total.toFixed(
                  2
                )}`
              )
            }
            className="mt-6 bg-emerald-500 text-white py-3 rounded-xl font-semibold"
          >
            Finalizar pedido no WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}