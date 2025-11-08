'use client';

import { useMemo } from 'react';

export default function FreeShippingBar({
  subtotal,
  target = 199.9, // valor para frete grátis
}: {
  subtotal: number;
  target?: number;
}) {
  const pct = useMemo(() => Math.max(0, Math.min(1, subtotal / target)), [subtotal, target]);
  const falta = Math.max(0, target - subtotal);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      {subtotal >= target ? (
        <p className="text-sm text-emerald-400 font-medium">🎉 Frete grátis liberado!</p>
      ) : (
        <>
          <p className="text-sm text-white/80">
            Faltam <span className="text-white font-semibold">R$ {falta.toFixed(2).replace('.', ',')}</span> para
            liberar frete grátis.
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${pct * 100}%` }}
              aria-label={`Progresso ${Math.round(pct * 100)}%`}
            />
          </div>
        </>
      )}
    </div>
  );
}