"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/components/products/data";
import { useCart } from "../../cart-provider";

type Props = {
  product: Product;
};

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function ProductClient({ product }: Props) {
  const { addToCart } = useCart(); // <- nome certo da função do contexto
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  function handleChangeQty(delta: number) {
    setQty((current) => {
      const next = current + delta;
      if (next < 1) return 1;
      if (next > 20) return 20;
      return next;
    });
  }

  function handleAddToCart() {
    addToCart(product, qty);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  return (
    <div className="pb-10">
      {/* IMAGEM DO PRODUTO */}
      <div className="relative w-full overflow-hidden rounded-b-[32px] bg-zinc-950 border-b border-zinc-900 aspect-[4/5]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 600px, 100vw"
        />
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* TÍTULO E DESCRIÇÃO */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-zinc-300 text-sm leading-relaxed">
            {product.description}
          </p>
        </header>

        {/* PREÇO */}
        <section className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-emerald-400">
              R$ {brl(product.price)}
            </span>
            {typeof product.oldPrice === "number" && (
              <span className="text-zinc-500 line-through">
                R$ {brl(product.oldPrice)}
              </span>
            )}
          </div>
        </section>

        {/* QUANTIDADE */}
        <section className="space-y-2">
          <span className="block text-sm text-zinc-300">Quantidade:</span>
          <div className="inline-flex items-center justify-between gap-4 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2">
            <button
              type="button"
              onClick={() => handleChangeQty(-1)}
              className="h-9 w-9 rounded-full border border-zinc-700 flex items-center justify-center text-xl leading-none active:scale-95 transition"
            >
              −
            </button>
            <span className="text-lg font-semibold w-8 text-center">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => handleChangeQty(1)}
              className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-xl leading-none text-white active:scale-95 transition"
            >
              +
            </button>
          </div>
        </section>

        {/* BOTÕES PRINCIPAIS */}
        <section className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-full bg-emerald-500 py-3.5 text-base font-semibold text-white shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-[0.99] transition"
          >
            Adicionar ao carrinho
          </button>

          <Link
            href="/checkout"
            className="block w-full rounded-full border border-emerald-500/70 py-3 text-base font-medium text-emerald-400 text-center hover:bg-emerald-500/10 transition"
          >
            Ir para o carrinho
          </Link>

          <Link
            href="/"
            className="block w-full rounded-full border border-zinc-700 py-3 text-base font-medium text-zinc-200 text-center hover:bg-zinc-900 transition"
          >
            Voltar para a loja
          </Link>
        </section>
      </div>

      {/* TOAST “PRODUTO ADICIONADO” COM GLOW */}
      {showToast && (
        <div className="fixed inset-x-0 bottom-4 px-4 z-50">
          <div className="mx-auto max-w-xl">
            <div className="relative group">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/40 via-emerald-400/20 to-emerald-500/40 blur-2xl opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-3xl bg-zinc-950/95 border border-emerald-500/60 px-4 py-3 flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.8)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/90 text-black text-lg">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-300">
                    Produto adicionado
                  </p>
                  <p className="text-xs text-zinc-300">
                    {product.name} (Qtd: {qty}) foi colocado no seu
                    carrinho.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowToast(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}