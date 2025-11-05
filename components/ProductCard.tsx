// components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  price: number;
  image: string;
  onAdd?: () => void;
};

const toBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ProductCard({ id, title, price, image, onAdd }: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-white">{title}</h3>
      <p className="text-emerald-400">{toBRL(price)}</p>

      <div className="mt-3 flex gap-3">
        <button
          onClick={onAdd}
          className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
        >
          Adicionar
        </button>
        <Link
          href={`/p/${id}`}
          className="rounded-xl border border-zinc-700 px-4 py-2 text-zinc-100 hover:bg-zinc-800"
        >
          Ver
        </Link>
      </div>
    </div>
  );
}