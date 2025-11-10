'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// ⚠️ Não exporte `metadata` neste arquivo!

import { useCart } from '@/components/cart/context';
// continue importando seus próprios componentes de UI,
// por exemplo:
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select } from '@/components/ui/select';
// import { toast } from '@/components/ui/use-toast';

export default function CheckoutPage() {
  const { items, total, removeItem, clear, applyCoupon } = useCart();

  // Aqui mantenha TODO o seu JSX original (cards, inputs, botões, toasts)
  // Só garanta que não tem `metadata` neste arquivo.
  // Exemplo simplificado para ilustrar (substitua pelo seu JSX atual):

  return (
    <main className="container mx-auto px-4 py-6">
      {/* SEU CABEÇALHO / CARRINHO BONITO */}
      {/* Liste itens, mostre total, inputs de endereço, cupom, botões etc. */}
      {/* Continue chamando suas funções do contexto useCart normalmente */}
    </main>
  );
}