"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ToastPayload = {
  id?: string;
  title?: string;
  description?: string;
  variant?: "success" | "info" | "error";
  actionLabel?: string;
  actionHref?: string;
  durationMs?: number;
};

type T = ToastPayload & { id: string; createdAt: number };

const EVT = "app:toast";

export function toast(payload: ToastPayload) {
  const id = crypto.randomUUID();
  const event = new CustomEvent<T>(EVT, {
    detail: {
      id,
      title: payload.title ?? "Tudo certo!",
      description: payload.description ?? "",
      variant: payload.variant ?? "info",
      actionLabel: payload.actionLabel,
      actionHref: payload.actionHref,
      durationMs: payload.durationMs ?? 2800,
      createdAt: Date.now(),
    },
  });
  window.dispatchEvent(event);
}

export function ToastContainer() {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    function handler(e: Event) {
      const det = (e as CustomEvent<T>).detail;
      setItems((prev) => [...prev, det]);
      // remoção automática
      const timeout = setTimeout(
        () => setItems((prev) => prev.filter((t) => t.id !== det.id)),
        det.durationMs
      );
      return () => clearTimeout(timeout);
    }
    window.addEventListener(EVT, handler as EventListener);
    return () => window.removeEventListener(EVT, handler as EventListener);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] mx-auto flex w-full max-w-xl flex-col gap-3 px-4">
      {items.map((t) => (
        <ToastCard key={t.id} {...t} />
      ))}
    </div>
  );
}

function ToastCard({
  id,
  title,
  description,
  variant = "info",
  actionHref,
  actionLabel,
}: T) {
  const color =
    variant === "success"
      ? "from-emerald-500/25 to-emerald-500/10 ring-emerald-400/30 text-emerald-50"
      : variant === "error"
      ? "from-rose-500/25 to-rose-500/10 ring-rose-400/30 text-rose-50"
      : "from-sky-500/20 to-sky-500/10 ring-sky-400/30 text-sky-50";

  return (
    <div
      className={`pointer-events-auto rounded-2xl bg-gradient-to-b ${color} backdrop-blur supports-[backdrop-filter]:bg-white/10 ring-1 px-4 py-3 shadow-2xl shadow-black/40`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-2 w-2 rounded-full bg-white/80" />
        <div className="min-w-0 flex-1">
          {title && <div className="text-sm font-semibold leading-5">{title}</div>}
          {description && (
            <div className="mt-0.5 truncate text-sm/5 text-white/80">{description}</div>
          )}
          {actionHref && actionLabel && (
            <div className="pt-2">
              <Link
                href={actionHref}
                className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                {actionLabel}
              </Link>
            </div>
          )}
        </div>
        <button
          aria-label="Fechar"
          onClick={() =>
            document.dispatchEvent(
              new CustomEvent("close-toast-" + id, { bubbles: true })
            )
          }
          className="rounded-md px-2 text-white/70 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}