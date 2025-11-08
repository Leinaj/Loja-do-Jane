'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {
  const { items, remove, clear } = useCart();

  const subtotal = (items ?? []).reduce(
    (acc: number, it: any) => acc + (Number(it?.price) || 0) * (Number(it?.quantity) || 0),
    0
  );

  // fechar com ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* painél */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-neutral-900 text-neutral-100 shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Carrinho"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-lg font-semibold">Seu carrinho</h2>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-neutral-300 hover:bg-white/10"
            aria-label="Fechar carrinho"
          >
            ✕
          </button>
        </div>

        <div className="h-[calc(100%-10rem)] overflow-y-auto px-4 py-3 space-y-3">
          {(items ?? []).length === 0 && (
            <p className="text-sm text-neutral-400">Seu carrinho está vazio.</p>
          )}

          {(items ?? []).map((it: any) => (
            <div
              key={`${it.id}`}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-neutral-800/60 p-3"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-md bg-neutral-700">
                {/* Se tiver configurado next/image pode usar <Image/>; caso não, <img/> */}
                {it.image ? (
                  <Image
                    src={it.image}
                    alt={it.name ?? 'Produto'}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{it.name}</p>
                <p className="text-xs text-neutral-400">
                  {it.quantity} × R$ {Number(it.price).toFixed(2).replace('.', ',')}
                </p>
              </div>

              <button
                onClick={() => remove(String(it.id))}
                className="rounded-md bg-rose-600 px-2 py-1 text-xs font-medium hover:bg-rose-500"
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-neutral-900/80 p-4 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-neutral-300">Subtotal</span>
            <strong className="text-base">
              R$ {subtotal.toFixed(2).replace('.', ',')}
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clear}
              className="w-1/2 rounded-md bg-neutral-700 px-3 py-2 text-sm hover:bg-neutral-600"
            >
              Limpar
            </button>
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-1/2 rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-medium hover:bg-emerald-500"
            >
              Ir ao checkout
            </Link>
          </div>

          <Link
            href="/"
            onClick={onClose}
            className="mt-3 block text-center text-xs text-neutral-400 hover:text-neutral-200"
          >
            Continuar comprando
          </Link>
        </div>
      </aside>
    </>
  );
}