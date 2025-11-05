// app/p/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PRODUCTS, money } from "@/lib/products";

type Cart = Record<string, number>;

export default function ProductPage() {
  const { id: raw } = useParams<{ id: string }>();
  const id = Array.isArray(raw) ? raw[0] : raw;
  const router = useRouter();

  const product = useMemo(() => PRODUCTS.find(p => p.id === id), [id]);
  const [qtd, setQtd] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout((showToast as any)._t);
    (showToast as any)._t = setTimeout(() => setToast(null), 1500);
  };

  const addToCart = () => {
    if (!product || !id) return;
    try {
      const raw = localStorage.getItem("cart");
      const cart: Cart = raw ? JSON.parse(raw) : {};
      cart[id] = (cart[id] ?? 0) + qtd;
      localStorage.setItem("cart", JSON.stringify(cart));
      showToast("Produto adicionado ao carrinho ✅");
    } catch {}
  };

  if (!product) {
    return (
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-semibold mb-4">Produto não encontrado</h1>
          <button onClick={() => router.push("/")} className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800">
            Voltar para a loja
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-zinc-400 mb-6">
          <Link href="/" className="hover:text-zinc-200">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-200">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <Image src={product.image} alt={product.name} width={1200} height={1200} className="w-full h-auto" priority />
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
            <div className="text-emerald-400 text-2xl font-semibold">{money(product.price)}</div>
            <p className="text-zinc-300 mt-4">
              {product.description ?? "Produto de alta qualidade, com opção de troca em 30 dias."}
            </p>

            <div className="mt-6 flex items-center gap-2">
              <button onClick={() => setQtd(q => Math.max(1, q - 1))} className="px-3 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800">-</button>
              <span className="min-w-[2ch] text-center">{qtd}</span>
              <button onClick={() => setQtd(q => q + 1)} className="px-3 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800">+</button>
            </div>

            <div className="mt-6 flex gap-3">
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

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
