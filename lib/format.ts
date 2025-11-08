// lib/format.ts
export function money(value: number): string {
  try {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    // fallback simples, caso toLocaleString falhe em algum ambiente
    const n = Number(value || 0).toFixed(2).replace('.', ',');
    return `R$ ${n}`;
  }
}