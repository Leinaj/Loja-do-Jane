'use client';

import { useEffect, useState } from 'react';

type Props = {
  subtotal: number;
  cep: string;
  onFreight: (valor: number, label: string) => void;
};

export default function ShippingCalc({ subtotal, cep, onFreight }: Props) {
  const [label, setLabel] = useState<string>('Calcular frete');
  const [valor, setValor] = useState<number>(0);

  // regra simples: frete grátis acima de 199
  useEffect(() => {
    if (subtotal >= 19900) { // em centavos se você usar centavos; ajuste se for em reais
      setLabel('Frete grátis');
      setValor(0);
      onFreight(0, 'Frete grátis');
      return;
    }
  }, [subtotal, onFreight]);

  const calcular = () => {
    const limpo = (cep || '').replace(/\D/g, '');
    if (limpo.length !== 8) return;

    // cálculo fake só para UX — troque por sua API real
    const sufixo = Number(limpo.slice(-3));
    const base = 1890 + (sufixo % 900); // 18,90 ~ 27,90
    setValor(base);
    setLabel(`PAC (5-8 dias)`);
    onFreight(base, 'PAC (5-8 dias)');
  };

  useEffect(() => {
    calcular();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-1 text-sm font-medium text-white/80">Frete</div>
      <div className="flex items-center justify-between">
        <span className="text-white/70">{label}</span>
        <span className="font-semibold text-emerald-300">
          {valor === 0 ? 'R$ 0,00' : valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>
    </div>
  );
}