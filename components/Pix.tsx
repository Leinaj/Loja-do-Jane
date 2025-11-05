"use client";

import { useState } from "react";

export default function Pix() {
  const [ok, setOk] = useState(false);
  const pix = "44988606483";

  async function copy() {
    await navigator.clipboard.writeText(pix);
    setOk(true);
    setTimeout(() => setOk(false), 1500);
  }

  return (
    <div className="flex items-center gap-3">
      <code className="rounded-xl bg-zinc-800 px-3 py-2 text-lg text-zinc-100">
        {pix}
      </code>
      <button
        onClick={copy}
        className="rounded-xl border border-zinc-700 px-4 py-2 text-zinc-100 hover:bg-zinc-800"
      >
        {ok ? "Copiado!" : "Copiar chave"}
      </button>
    </div>
  );
}