"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { products } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import { useMemo, useState } from "react";

type AnyProduct = {
  id?: string | number;
  slug: string;
  name?: string;
  title?: string;
  image: string;
  price?: number;
  value?: number;
  oldPrice?: number;
  description?: string;
  badge?: string;
  [k: string]: any;
};

const money = (n: number) =>
  (n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const product = useMemo(() => {
    const p = (products as AnyProduct[]).find((x) => x.slug === params.slug);
    if (!p) return null;
    // normaliza campos para evitar TS chato
    return {
      ...p,
      name: p.name ?? p.title ?? "Produto",
      price: p.price ?? p.value ?? 0,
    };
  }, [params.slug]);

  if (!product) return notFound();

  const inc = () => setQty((q) => Math.min(q + 1, 20));
  const dec = () => setQty((q) => Math.max(q - 1, 1));

  const handleAdd = () => {
    // add(produto, quantidade)
    add(product as any, qty);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Loja da Jane
          </Link>
          <Link href="/checkout" className="btn">Ir para o carrinho</Link>
        </div>
      </header>

      <main className="container grid gap-8 py-8 lg:grid-cols-2">
        <div className="card relative overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority={false}
            />
            {product.badge && (
              <span className="absolute left-3 top-3 rounded-lg bg-brand-500 px-2 py-1 text-xs font-semibold shadow-soft">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <nav className="mb-2 text-sm text-neutral-400">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="px-2">/</span>
              <span className="text-white">{product.name}</span>
            </nav>
            <h1 className="text-2xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold">{money(product.price)}</span>
            {!!product.oldPrice && (
              <span className="text-neutral-400 line-through">
                {money(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="text-neutral-300">
            {product.description ??
              "Produto original selecionado com carinho pela Jane. Garantia de satisfação e envio rápido."}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-white/10">
              <button onClick={dec} className="px-3 py-2 text-xl">–</button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={inc} className="px-3 py-2 text-xl">+</button>
            </div>
            <button onClick={handleAdd} className="btn flex-1">
              Adicionar ao carrinho
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 p-4">
            <h3 className="mb-2 font-semibold">Envio & Pagamento</h3>
            <ul className="list-disc space-y-1 pl-5 text-neutral-300">
              <li>Pagamento por Pix (confirmação imediata).</li>
              <li>Entrega em Maringá/PR e região ou envio pelos Correios.</li>
              <li>Fale com a Jane no WhatsApp para combinar o frete.</li>
            </ul>
          </div>

          <div className="text-sm text-neutral-400">
            <Link href="/checkout" className="underline hover:text-white">
              Ver carrinho e finalizar
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}