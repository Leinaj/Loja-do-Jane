'use client';

import { useState } from 'react';

export default function PixCopy({ keyPix }: { keyPix: string }) {
  const [ok, setOk] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(keyPix);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch {}
  }

  return (
    <button
      onClick={handleCopy}
      className="btn btn-primary"
      aria-label="Copiar chave PIX"
    >
      {ok ? 'Copiado!' : 'Copiar chave'}
    </button>
  );
}