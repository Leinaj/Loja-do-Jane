'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { toast } from '@/components/ui/toast';

export default function ProdutoPage({ product }: { product: {
  id: string | number;
  name: string;
  price: number;
  image?: string; // ex.: "/moletom.jpg"
}}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  function handleAdd() {
    if (!product) return;

    add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      qty,
    });

    toast({
      title: 'Produto adicionado!',
      description: `${qty} × ${product.name} foi adicionado ao carrinho.`,
      variant: 'success',
      actionPrimary: {              // <-- troque "action" por "actionPrimary"
        label: 'Ver carrinho',
        href: '/checkout',
      },
      actionSecondary: {            // <-- botão opcional para continuar
        label: 'Continuar comprando',
        href: '/',
      },
      durationMs: 2800,             // <-- troque "duration" por "durationMs"
    });
  }

  // --- UI (exemplo) ---
  return (
    <div className="space-y-4">
      {/* ... sua UI de produto ... */}

      <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 text-2xl">−</button>
        <span className="mx-4 min-w-[2ch] text-center text-lg tabular-nums">{qty}</span>
        <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="px-3 text-2xl">+</button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500"
        >
          Adicionar ao carrinho
        </button>

        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-base font-medium text-emerald-300/90 transition hover:bg-white/10"
        >
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}