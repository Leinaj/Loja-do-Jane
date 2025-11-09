// utils/format.ts
export function formatBRL(value: number) {
  try {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  } catch {
    return `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;
  }
}

/**
 * Garante que o valor do frete é plausível para exibição:
 * - ignora NaN/∞/negativos
 * - descarta valores irreais (> 500)
 * Retorna null quando inválido.
 */
export function saneShipping(value: unknown): number | null {
  const n = Number(value);
  if (!isFinite(n) || n <= 0) return null;
  if (n > 500) return null;
  return Number(n.toFixed(2));
}

/** Corrige casos comuns: "2440" -> 24.40 (centavos perdidos na API) */
export function tryFixCents(value: unknown): number | null {
  const raw = String(value ?? '').replace(/[^\d]/g, '');
  if (!raw) return null;
  if (raw.length === 4) {
    const num = Number(`${raw.slice(0, 2)}.${raw.slice(2)}`);
    return isFinite(num) ? num : null;
  }
  return null;
}