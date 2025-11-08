"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

type ToastVariant = "success" | "info" | "error";

type ToastAction =
  | { label: string; href: string; onClick?: never }
  | { label: string; onClick: () => void; href?: never };

export type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  image?: string; // miniatura opcional (ex.: "/moletom.jpg")
  variant?: ToastVariant;
  actionPrimary?: ToastAction;
  actionSecondary?: ToastAction;
  duration?: number; // ms (default 2800)
};

type ToastInternal = Required<ToastOptions> & { id: string; createdAt: number };

type ToastContextType = {
  show: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// API simples: import { toast } from "@/components/ui/toast"
export let toast = (opts: ToastOptions) => {
  console.warn("toast() chamado fora do provider");
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);
  const idRef = useRef(0);

  const show = useCallback((opts: ToastOptions) => {
    const id = (opts.id ?? `t_${++idRef.current}`).toString();
    const t: ToastInternal = {
      id,
      title: opts.title ?? "",
      description: opts.description ?? "",
      image: opts.image ?? "",
      variant: opts.variant ?? "success",
      actionPrimary: opts.actionPrimary ?? { label: "", href: "" as any },
      actionSecondary:
        opts.actionSecondary ?? ({ label: "", onClick: () => {} } as any),
      duration: opts.duration ?? 2800,
      createdAt: Date.now(),
    };
    setToasts((curr) => [...curr, t]);
  }, []);

  // expõe função global “toast”
  toast = show;

  const remove = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <ToastViewport toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onRemove,
}: {
  toasts: ToastInternal[];
  onRemove: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const root = typeof window !== "undefined" ? document.body : null;
  if (!mounted || !root) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[60] mx-auto flex w-full max-w-3xl flex-col gap-3 px-3 sm:bottom-6">
      {toasts.map((t) => (
        <ToastItem key={t.id} data={t} onRemove={onRemove} />
      ))}
    </div>,
    root
  );
}

function ToastItem({
  data,
  onRemove,
}: {
  data: ToastInternal;
  onRemove: (id: string) => void;
}) {
  const { id, duration, variant } = data;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const started = Date.now();
    const total = duration;
    const iv = setInterval(() => {
      const elapsed = Date.now() - started;
      const pct = Math.max(0, 100 - (elapsed / total) * 100);
      setProgress(pct);
      if (elapsed >= total) {
        clearInterval(iv);
        onRemove(id);
      }
    }, 16);
    return () => clearInterval(iv);
  }, [id, duration, onRemove]);

  const colorByVariant = useMemo(() => {
    switch (variant) {
      case "error":
        return "from-rose-500/15 via-rose-400/10 to-rose-500/15 ring-rose-400/20";
      case "info":
        return "from-sky-500/15 via-sky-400/10 to-sky-500/15 ring-sky-400/20";
      default:
        return "from-emerald-500/15 via-emerald-400/10 to-emerald-500/15 ring-emerald-400/20";
    }
  }, [variant]);

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorByVariant} p-3 backdrop-blur-md ring-1 shadow-2xl`}
    >
      {/* barra de progresso */}
      <div
        className="absolute inset-x-0 top-0 h-1 bg-white/20"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black 8px, black calc(100% - 8px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 8px, black calc(100% - 8px), transparent 100%)",
        }}
      />
      <div
        className="absolute top-0 left-0 h-1 bg-white/70"
        style={{ width: `${progress}%` }}
      />

      <div className="flex items-start gap-3">
        {data.image ? (
          // miniatura
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.image}
            alt=""
            className="mt-0.5 h-12 w-12 flex-none rounded-xl object-cover ring-1 ring-white/15"
          />
        ) : (
          <span className="mt-2 inline-block size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
        )}

        <div className="min-w-0 flex-1">
          {data.title && (
            <p className="text-base font-semibold leading-6 text-white">
              {data.title}
            </p>
          )}
          {data.description && (
            <p className="mt-0.5 text-sm leading-6 text-white/80">
              {data.description}
            </p>
          )}

          {/* ações */}
          <div className="mt-3 flex flex-wrap gap-2">
            {data.actionPrimary?.label &&
              ("href" in data.actionPrimary ? (
                <Link
                  href={data.actionPrimary.href}
                  className="inline-flex items-center justify-center rounded-xl bg-white/90 px-3.5 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-white"
                >
                  {data.actionPrimary.label}
                </Link>
              ) : (
                <button
                  onClick={data.actionPrimary.onClick}
                  className="inline-flex items-center justify-center rounded-xl bg-white/90 px-3.5 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-white"
                >
                  {data.actionPrimary.label}
                </button>
              ))}

            {data.actionSecondary?.label &&
              ("href" in data.actionSecondary ? (
                <Link
                  href={data.actionSecondary.href}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  {data.actionSecondary.label}
                </Link>
              ) : (
                <button
                  onClick={data.actionSecondary.onClick}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-3.5 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  {data.actionSecondary.label}
                </button>
              ))}
          </div>
        </div>

        {/* fechar */}
        <button
          aria-label="Fechar"
          onClick={() => onRemove(data.id)}
          className="mt-1 rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}