"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

/** ============== CONFIG RÁPIDA ============== */
const WHATSAPP = "+5544988606483"; // coloque seu número com DDI e DDD
const PIX_KEY = "44988606483";

// imagens esperadas em /public/images
//   - /images/camiseta-preta.jpg
//   - /images/camiseta-branca.jpg
//   - /images/moletom.jpg
//   - /images/bone.jpg
const PRODUCTS = [
  {
    id: "camiseta-preta",
    name: "Camiseta Preta",
    price: 69.9,
    image: "/images/camiseta-preta.jpg",
  },
  {
    id: "camiseta-branca",
    name: "Camiseta Branca",
    price: 69.9,
    image: "/images/camiseta-branca.jpg",
  },
  {
    id: "moletom",
    name: "Moletom",
    price: 159.9,
    image: "/images/moletom.jpg",
  },
  {
    id: "bone",
    name: "Boné",
    price: 59.9,
    image: "/images/bone.jpg",
  },
] as const;

// logos esperadas em /public/brands (160x80 aprox. fica lindo)
//   - /brands/nokia.png
//   - /brands/canon.png
//   - /brands/samsung.png
//   - /brands/apple.png
const BRANDS = ["nokia", "canon", "samsung", "apple"] as const;

/** ============== HELPERS ============== */
type Cart = Record<string, number>;
const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** ============== PÁGINA ============== */
export default function Page() {
  const [cart, setCart] = useState<Cart>({});

  const items = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const p = PRODUCTS.find((x) => x.id === id)!;
          return { ...p, qty, subtotal: p.price * qty };
        }),
    [cart]
  );

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.subtotal, 0),
    [items]
  );

  function add(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }
  function remove(id: string) {
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return c;
      next[id]--;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }

  const waText = encodeURIComponent(
    `Olá! Quero finalizar meu pedido:\n\n${items
      .map((i) => `• ${i.name} x${i.qty} — ${brl(i.subtotal)}`)
      .join("\n")}\n\nTotal: ${brl(total)}`
  );
  const waLink = `https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=${waText}`;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Barra de topo */}
      <div className="border-b border-zinc-900 bg-zinc-950/70 text-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <span className="hidden sm:block">
            Bem-vinda à <b>Loja da Jane</b> ✨
          </span>
          <a
            href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`}
            target="_blank"
            className="opacity-80 hover:opacity-100"
          >
            Suporte: WhatsApp {WHATSAPP}
          </a>
          <span className="opacity-70">
            Carrinho: {items.length} itens — {brl(total)}
          </span>
        </div>
      </div>

      {/* Header / Nav */}
      <header className="sticky top-0 z-30 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
          <Link href="/" className="font-bold text-xl whitespace-nowrap">
            <span className="bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
              u
            </span>
            commerce
          </Link>
          <div className="hidden gap-6
