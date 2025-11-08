"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { toast } from "@/components/ui/toast";

type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image: string;
};

export default function AddToCart({ product }: { product: ProductLite }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  function inc() {
    setQty((n) => Math.min(99, n + 1));
  }
  function dec() {
    setQty((n) => Math.max(1, n - 1));
  }

  function handleAdd() {
    const item = {
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    };
    add(item);

    // Toast bonito
    toast({
      title: "Produto adicionado!",
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
      variant: "success",
      actionLabel: "Ver carrinho",
      actionHref: "/checkout",
      durationMs: 2800,
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <button
          onClick={dec}
          className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-lg hover:bg-white/10"
        >
          –
        </button>
        <div className="min-w-[72px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
          {qty}
        </div>
        <button
          onClick={inc}
          className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-lg hover:bg-white/10"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="flex-1 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400"
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}