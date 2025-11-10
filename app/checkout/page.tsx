import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/context';

export const dynamic = 'force-dynamic'; // garante render no client side

export default function CheckoutPage() {
  // este componente precisa ser client para usar o contexto
  return <CheckoutClient />;
}

'use client';
function CheckoutClient() {
  const { items, total, removeItem, clearCart } = useCart();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <section className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Carrinho</h1>

        {items.length === 0 ? (
          <div className="rounded-xl border border-white/10 p-6 text-center">
            <p className="mb-4 opacity-80">Seu carrinho está vazio.</p>
            <Link href="/" className="inline-block rounded-full bg-emerald-600 text-white px-5 py-2">
              Voltar para a loja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-neutral-800 p-4"
              >
                {/* MINIATURA */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-700">
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>

                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm opacity-80">
                    {it.quantity} × R$ {it.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    R$ {(it.price * it.quantity).toFixed(2).replace('.', ',')}
                  </div>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="mt-2 rounded-full bg-rose-700/70 px-3 py-1 text-sm text-white"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <div className="text-lg">
                <span className="opacity-80">Total: </span>
                <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
              </div>
              <button
                onClick={clearCart}
                className="rounded-full border border-white/15 px-4 py-2"
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </section>

      {/* … sua seção de endereço / resumo permanece igual … */}
    </main>
  );
}