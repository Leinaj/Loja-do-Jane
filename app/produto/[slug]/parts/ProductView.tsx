"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { toast } from "@/components/ui/toast";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string; // ex.: "/moletom.jpg"
  description?: string;
  oldPrice?: number;
  badge?: string;
};

export default function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(99, q + 1));

  const handleAdd = () => {
    // item para o carrinho (garantindo id como string)
    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity, // ✅ chave correta
    });

    // toast elegante (compatível com o novo toast.tsx)
    toast({
      title: "Produto adicionado!",
      description: `${quantity} × ${product.name} foi adicionado ao carrinho.`,
      variant: "success",
      action: { label: "Ver carrinho", href: "/checkout" },
      duration: 2800,
    });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      {/* Imagem do produto */}
      <div className="rounded-2xl bg-zinc-900/40 p-3 ring-1 ring-white/10 shadow-lg">
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            width={1600}
            height={1200}
            priority
            className="h-auto w-full object-cover"
          />
        </div>
      </div>

      {/* Badges */}
      {product.badge && (
        <div className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 ring-1 ring-emerald-500/30">
            {product.badge}
            <span aria-hidden>🔥</span>
          </span>
        </div>
      )}

      {/* Título e descrição */}
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {product.name}
      </h1>
      {product.description && (
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-zinc-300">
          {product.description}
        </p>
      )}

      {/* Preço */}
      <div className="mt-4 flex items-end gap-3">
        <span className="text-3xl font-semibold text-emerald-400">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </span>
        {typeof product.oldPrice === "number" && (
          <span className="translate-y-[-2px] text-lg text-zinc-500 line-through">
            R$ {product.oldPrice.toFixed(2).replace(".", ",")}
          </span>
        )}
      </div>

      {/* Quantidade */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Quantidade:
        </label>
        <div className="flex w-40 items-center justify-between rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-2">
          <button
            type="button"
            onClick={dec}
            className="grid size-8 place-items-center rounded-lg bg-zinc-800/70 text-zinc-200 ring-1 ring-white/10 transition hover:bg-zinc-800 active:scale-95"
            aria-label="Diminuir"
          >
            –
          </button>
          <span className="select-none text-lg font-medium text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={inc}
            className="grid size-8 place-items-center rounded-lg bg-zinc-800/70 text-zinc-200 ring-1 ring-white/10 transition hover:bg-zinc-800 active:scale-95"
            aria-label="Aumentar"
          >
            +
          </button>
        </div>
      </div>

      {/* Ações */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
    </section>
  );
}