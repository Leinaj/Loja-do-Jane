"use client";
import { useState } from "react";

export default function PixCopy({ value }: { value: string }) {
  const [ok, setOk] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch {}
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="px-4 py-3 bg-zinc-900 rounded-xl border border-zinc-800 font-mono">
        {value}
      </div>
      <button onClick={copy} className="btn-primary">Copiar chave</button>
      {ok && <span className="text-emerald-400 text-sm">Copiado!</span>}
    </div>
  );
}