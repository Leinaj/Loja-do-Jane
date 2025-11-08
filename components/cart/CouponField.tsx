'use client';

import { useState } from 'react';

type Props = {
  onApply: (percent: number, code: string) => void;
};

export default function CouponField({ onApply }: Props) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    setError(null);
    const normalized = code.trim().toUpperCase();
    if (normalized === 'JANE10') {
      onApply(10, normalized);
      setApplied(normalized);
    } else if (normalized === 'FRETEGRATIS') {
      onApply(0, normalized); // só demonstração; você pode tratar frete lá fora
      setApplied(normalized);
    } else {
      setApplied(null);
      setError('Cupom inválido.');
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 text-sm font-medium text-white/80">Cupom de desconto</div>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="JANE10"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <button
          onClick={apply}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-500"
        >
          Aplicar
        </button>
      </div>
      {applied && (
        <p className="mt-2 text-sm text-emerald-300">Cupom <b>{applied}</b> aplicado!</p>
      )}
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </div>
  );
}