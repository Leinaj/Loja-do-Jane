"use client";

import { useState } from "react";

export default function PixCopy({ pix }: { pix: string }) {
  const [ok, setOk] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(pix);
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    } catch {
      setOk(false);
      alert("Não foi possível copiar a chave PIX.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <code className="rounded-xl bg-zinc-800 px-3 py-2 text-lg tracking-wider">
          {pix}
        </code>
        <button
          onClick={copy}
          className="rounded-xl border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-800 active:scale-[.98]"
        >
          {ok ? "Copiado!" : "Copiar chave"}
        </button>
      </div>
      <p className="text-zinc-400">
        Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
      </p>
    </div>
  );
}