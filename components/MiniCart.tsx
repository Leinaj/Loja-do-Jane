// components/MiniCart.tsx
"use client";

import Image from "next/image";
import { formatBRL, type Product } from "@/lib/products";

type Line = Product & { qty: number; lineTotal: number };

export default function MiniCart({
  open,
  onClose,
  lines,
  onInc,
  onDec,
  onClear,
  totalCents,
  onCopyOrder,
  onWhatsCheckout,
}: {
  open: boolean;
  onClose: () => void;
  lines: Line[];
  totalCents: number;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onClear: () => void;
  onCopyOrder: () => void;
  onWhatsCheckout: () => void;
}) {
  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      {/* panel */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[92%] sm:w-[420px] bg-zinc-950 border-l border-zinc-800 transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
          <div className="text-lg font-semibold">Seu carrinho</div>
          <div className="flex gap-2">
            <button onClick={onClear} className="text-sm px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-900">
              Esvaziar
            </button>
            <button onClick={onClose} className="text-sm px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-900">
              Fechar
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-168px)] overflow-y-auto divide-y divide-zinc-800">
          {lines.length === 0 ? (
            <div className="p-6 text-zinc-400">Seu carrinho está vazio.</div>
          ) : (
            lines.map(l => (
              <div key={l.id} className="p-4 flex items-center gap-3">
                <Image src={l.image} alt={l.name} width={64} height={64} className="rounded-md border border-zinc-800"/>
                <div className="flex-1">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-zinc-400">{formatBRL(l.price)} × {l.qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onDec(l.id)} className="w-8 h-8 rounded border border-zinc-700 hover:bg-zinc-900">-</button>
                  <span className="w-6 text-center">{l.qty}</span>
                  <button onClick={() => onInc(l.id)} className="w-8 h-8 rounded border border-zinc-700 hover:bg-zinc-900">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Total</span>
            <span className="text-lg font-semibold">{formatBRL(totalCents)}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onCopyOrder} className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900">
              Copiar pedido
            </button>
            <button onClick={onWhatsCheckout} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">
              Finalizar no Whats
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
