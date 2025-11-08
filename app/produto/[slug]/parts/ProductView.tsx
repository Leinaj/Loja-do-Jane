"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { toast } from "@/components/ui/toast";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string; // ex.: "/moletom.jpg"
  description?: string;
  badge?: string;
};

export default function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(99, q + 1));

  const handleAdd = () => {
    // adiciona ao carrinho com a chave correta
    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });

    const subtotal = (product.price * quantity).toFixed(2).replace(".", ",");

    // toast novo — não usa "action", e sim actionPrimary / actionSecondary
    toast({
      title: "Produto adicionado!",
      description: `${quantity} × ${product.name} — Subtotal R$ ${subtotal}`,
      image: product.image,
      variant: "success",
      actionPrimary: { label: "Ver carrinho", href: "/checkout" },
      actionSecondary: { label: "Continuar comprando", href: "/" },
      duration: 2800,
    });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-12">
      {/* Imagem */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/40 to-zinc-900/20 p-4 shadow-xl">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Info */}
      <div className="mt-8">
        {product.badge && (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/15 px-3 py-1 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/20">
            {product.badge}
          </span>
        )}

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          {product.name}
        </h1>

        {product.description && (
          <p className="mt-2 max-w-2xl text-zinc-300">{product.description}</p>
        )}

        <div className="mt-4 text-3xl font-bold text-emerald-400">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </div>

        {/* Quantidade + Ações */}
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
            <span className="select-none text-lg font-medium text-white">
              {quantity}
            </span>
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
      </div>
    </section>
  );
}