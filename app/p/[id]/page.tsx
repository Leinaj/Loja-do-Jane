// app/p/[id]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { findProduct, money, Product } from "@/lib/products";

type Props = { params: { id: string } };

export default function ProductPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setProduct(findProduct(params.id) ?? null); }, [params.id]);

  const notify = (msg: string) => {
    setToast(msg);
    window.clearTimeout((notify as any)._t);
    (notify as any)._t = window.setTimeout(() => setToast(null), 1800);
  };

  const addToCart = () => {
    if (!product) return;
    const raw = localStorage.getItem("cart");
    const cart: Record<string, number> = raw ? JSON.parse(raw) : {};
    cart[product.id] = (cart[product.id] ?? 0) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    notify("Produto adicionado ao carrinho ✅");
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-200">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p>Produto não encontrado.</p>
          <Link href="/" className="text-emerald-400 underline">Voltar</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-zinc-400 hover:text-zinc-200">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
            <Image src={product.image} alt={product.name} width={800} height={800} className="w-full h-auto" priority />
          </div>

          <div>
            <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
            <div className="text-2xl text-emerald-400 font-bold mb-4">{money(product.price)}</div>
            <p className="text-zinc-300 mb-6">{product.description}</p>

            <div className="flex gap-3">
              <button onClick={addToCart} className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white">
                Adicionar ao carrinho
              </button>
              <Link href="/" className="px-5 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800">
                Voltar para a loja
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
