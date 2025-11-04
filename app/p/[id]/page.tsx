
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { findProduct, money } from "../../../lib/products";

const WHATSAPP_NUMBER = "5544988606483";
const PIX_KEY = "44988606483";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = findProduct(params.id);
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setCart(JSON.parse(raw));
    } catch {}
  }, []);

  if (!product) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold">Produto não encontrado</p>
          <Link href="/" className="mt-4 inline-block rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-800">
            Voltar para a loja
          </Link>
        </div>
      </main>
    );
  }

  const waMsg =
    `Olá! Tenho interesse em: ${product.name} — ${money(product.price)}\n\n` +
    `Chave PIX: ${PIX_KEY}`;

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

  function add() {
    setCart((c) => {
      const next = { ...c, [product.id]: (c[product.id] ?? 0) + 1 };
      try { localStorage.setItem("cart", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link href="/" className="text-sm text-neutral-300 hover:underline">← Voltar</Link>

        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-neutral-800">
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 text-3xl font-extrabold">{money(product.price)}</div>
            {product.description && (
              <p className="mt-3 text-neutral-300">{product.description}</p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={add}
                className="rounded-lg bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-500"
              >
                Adicionar ao carrinho
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-neutral-700 px-5 py-2 font-medium text-neutral-200 hover:bg-neutral-800"
              >
                Comprar no WhatsApp
              </a>
            </div>

            <p className="mt-3 text-sm text-neutral-400">
              Carrinho salvo no dispositivo. Para finalizar vários itens, volte à Home.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
