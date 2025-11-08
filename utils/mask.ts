export function maskPhoneBR(v: string) {
  return v
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

export function maskCEP(v: string) {
  return v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
}

export function onlyDigits(v: string) {
  return v.replace(/\D/g, '');
}

export function isCEPValid(cep: string) {
  return onlyDigits(cep).length === 8;
}

export function saneShipping(price: number) {
  // Evita valores fora da realidade (ex.: R$ 2440,00)
  if (!isFinite(price) || price <= 0) return null;
  if (price > 500) return null;
  return price;
}