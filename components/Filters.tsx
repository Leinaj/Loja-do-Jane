// components/Filters.tsx
"use client";

import { CATEGORIES, BRANDS } from "@/lib/products";

export default function Filters({
  q, setQ,
  category, setCategory,
  brand, setBrand,
  price, setPrice,
}: {
  q: string; setQ: (v: string)=>void;
  category: string; setCategory: (v: string)=>void;
  brand: string; setBrand: (v: string)=>void;
  price: number; setPrice: (v: number)=>void; // max em R$
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 grid gap-3 md:grid-cols-4">
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder="Buscar… (ex.: moletom)"
        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 md:col-span-2"
      />

      <select
        value={category}
        onChange={e=>setCategory(e.target.value)}
        className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
      >
        {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
      </select>

      <select
        value={brand}
        onChange={e=>setBrand(e.target.value)}
        className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
      >
        <option value="todas">Todas as marcas</option>
        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>

      <div className="md:col-span-4 flex items-center gap-3 pt-1">
        <label className="text-sm text-zinc-400">Preço máx. (R$)</label>
        <input
          type="range"
          min={20} max={400}
          value={price}
          onChange={(e)=>setPrice(parseInt(e.target.value))}
          className="flex-1"
        />
        <div className="w-16 text-right text-sm">{price}</div>
      </div>
    </div>
  );
}
