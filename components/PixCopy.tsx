"use client";
import { useState } from "react";

export default function PixCopy({ pix }: { pix: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex gap-3 items-center">
      <div className="card !p-3 font-mono text-lg">{pix}</div>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(pix);
          setOk(true);
          setTimeout(() => setOk(false), 2000);
        }}
        className="btn btn-primary"
      >
        {ok ? "Copiado!" : "Copiar chave"}
      </button>
    </div>
  );
}