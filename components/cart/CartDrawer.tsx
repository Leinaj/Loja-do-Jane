"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {
  const { items, remove, clear, total } = useCart();

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Painel */}
      <aside
        className={`absolute right-0 top-0 h-full w-[92%] max-w-md transform bg-[#0e1916] shadow-2xl ring-1 ring-white/10 transition duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <h2 className="text-lg font-semibold">Seu carrinho</h2>
          <button
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="rounded-lg px-2 py-1 text-zinc-300 hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        <div className="flex h-[calc(100%-64px)] flex-col">
          {/* Lista de itens */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {items.length === 0 ? (
              <div className="rounded-xl border border-white/10 p-6 text-center text-zinc-400">
                Seu carrinho está vazio.
              </div>
            ) : (
              items.map((it) => (
                <div
                  key={`${it.id}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg ring-1 ring-white/10">
                    <Image
                      src={it.image}
                      alt={it.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
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

          {/* Rodapé do drawer */}
          <div className="space-y-3 border-t border-white/10 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-300">Total</span>
              <strong className="text-base text-emerald-400">
                R$ {total.toFixed(2).replace(".", ",")}
              </strong>
            </div>

            <div className="flex gap-3">
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-center font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
              >
                Ir para o checkout
              </Link>
              <button
                onClick={clear}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-white/5"
              >
                Limpar
              </button>
            </div>

            <Link
              href="/"
              onClick={onClose}
              className="block rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-emerald-300 hover:bg-white/5"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}