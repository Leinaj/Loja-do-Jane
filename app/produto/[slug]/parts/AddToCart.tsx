"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { toast } from "@/components/ui/toast";

type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image: string; // ex.: "/moletom.jpg"
};

export default function AddToCart({ product }: { product: ProductLite }) {
  const { add } = useCart();
  const [qty, setQty] = useState<number>(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const handleAdd = () => {
    // adiciona ao carrinho com a chave correta "quantity"
    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });

    const subtotal = (product.price * qty).toFixed(2).replace(".", ",");

    // novo toast: usa actionPrimary / actionSecondary
    toast({
      title: "Produto adicionado!",
      description: `${qty} × ${product.name} — Subtotal R$ ${subtotal}`,
      image: product.image,
      variant: "success",
      actionPrimary: { label: "Ver carrinho", href: "/checkout" },
      actionSecondary: { label: "Continuar comprando", href: "/" },
      duration: 2800,
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex w-40 items-center justify-between rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-2">
        <button
          type="button"
          onClick={dec}
          aria-label="Diminuir"
          className="grid size-8 place-items-center rounded-lg bg-zinc-800/70 text-zinc-200 ring-1 ring-white/10 transition hover:bg-zinc-800 active:scale-95"
        >
          –
        </button>
        <span className="select-none text-lg font-medium text-white">{qty}</span>
        <button
          type="button"
          onClick={inc}
          aria-label="Aumentar"
          className="grid size-8 place-items-center rounded-lg bg-zinc-800/70 text-zinc-200 ring-1 ring-white/10 transition hover:bg-zinc-800 active:scale-95"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-base font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-[0.98] sm:w-auto"
      >
        Adicionar ao carrinho
      </button>

      <Link
        href="/"
        className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-transparent px-5 py-3 text-base font-semibold text-emerald-300 transition hover:bg-white/5 sm:w-auto"
      >
        Voltar para a loja
      </Link>
    </div>
  );
}