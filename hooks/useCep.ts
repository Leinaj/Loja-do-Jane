'use client';

import { useEffect, useMemo, useState } from 'react';
import { isCEPValid, onlyDigits } from '@/utils/mask';

type ViaCep = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export function useCep(cepMasked: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ViaCep | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cepDigits = useMemo(() => onlyDigits(cepMasked), [cepMasked]);

  useEffect(() => {
    let active = true;
    setError(null);

    if (!isCEPValid(cepMasked)) {
      setData(null);
      return;
    }

    setLoading(true);
    fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
      .then((r) => r.json())
      .then((json: ViaCep) => {
        if (!active) return;
        if (json?.erro) {
          setError('CEP não encontrado.');
          setData(null);
        } else {
          setData(json);
        }
      })
      .catch(() => {
        if (!active) return;
        setError('Falha ao consultar CEP.');
        setData(null);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [cepDigits, cepMasked]);

  return { loading, data, error };
}