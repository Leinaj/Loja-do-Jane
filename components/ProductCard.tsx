"use client";
import Image from "next/image";
import { Product } from "@/lib/products";

export default function ProductCard({
  p,
  onAdd
}: { p: Product; onAdd: (p: Product) => void }) {
  return (
    <div className="card">
      <div className="rounded-xl overflow-hidden bg-zinc-900">
        <Image
          src={p.image}
          alt={p.name}
          width={800}
          height={600}
          className="w-full h-64 object-cover"
          priority={false}
        />
      </div>
      <div className="mt-3">
        <div className="text-lg font-semibold">{p.name}</div>
        <div className="text-emerald-400 font-bold">R$ {(p.price/100).toFixed(2)}</div>
      </div>
      <div className="mt-3 flex gap-3">
        <button className="btn btn-primary" onClick={() => onAdd(p)}>Adicionar</button>
        <a
          className="btn btn-ghost"
          href={`https://wa.me/5544988606483?text=${encodeURIComponent(
            `Olá, tenho interesse no produto: ${p.name} (R$ ${(p.price/100).toFixed(2)})`
          )}`}
          target="_blank"
        >
          Ver
        </a>
      </div>
    </div>
  );
}