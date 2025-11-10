"use client";
import Link from "next/link";

export default function AddedToast({
  open,
  title,
  message,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed left-4 right-4 bottom-6 z-50">
      <div className="mx-auto max-w-xl rounded-2xl bg-neutral-900/95 border border-white/10 shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="mt-2 inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div className="flex-1">
            <div className="text-base font-semibold text-white">{title}</div>
            <div className="text-sm opacity-80">{message}</div>

            <Link
              href="/checkout"
              className="mt-3 inline-block rounded-full border border-white/15 px-4 py-2 text-sm"
              onClick={onClose}
            >
              Ver carrinho
            </Link>
          </div>

          <button
            aria-label="Fechar"
            className="opacity-70 hover:opacity-100 px-2"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}