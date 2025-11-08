'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ToastItem = {
  id: number;
  title?: string;
  description?: string;
  durationMs?: number;
  image?: string; // opcional, se quiser mostrar miniatura do produto
};

type ToastCtx = {
  push: (t: Omit<ToastItem, 'id'>) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<ToastItem[]>([]);
  const idRef = useRef(1);

  const push = (t: Omit<ToastItem, 'id'>) => {
    const id = idRef.current++;
    const duration = t.durationMs ?? 2800;
    setList((l) => [...l, { ...t, id, durationMs: duration }]);
    // auto close
    window.setTimeout(() => {
      setList((l) => l.filter((x) => x.id !== id));
    }, duration);
  };

  const value = useMemo(() => ({ push }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* fallback no-SSR renderer (sem portal) — só aparece se portal falhar */}
      <div className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 pointer-events-none sm:justify-end sm:px-6">
        <div className="w-full max-w-md space-y-2">
          {list.map((t) => (
            <ToastCard key={t.id} item={t} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

/**
 * Bridge opcional que cria um portal para o <body>, mas **só** após montar no cliente.
 * Evita "document is not defined" no build/prerender.
 */
export function ToastBridge() {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { push } = useToast(); // força o Provider acima na árvore

  // estado compartilhado com o Provider (render dos cards)
  const [list, setList] = useState<ToastItem[]>([]);
  const origPush = useRef<(t: Omit<ToastItem, 'id'>) => void>();

  // intercepta pushes do Provider para espelhar a lista aqui
  useEffect(() => {
    // Monkey-patch leve: ouvimos alterações pela CustomEvent
    const onAdd = (e: Event) => {
      const detail = (e as CustomEvent<ToastItem[]>).detail;
      setList(detail);
    };
    window.addEventListener('toast:list', onAdd as EventListener);
    return () => window.removeEventListener('toast:list', onAdd as EventListener);
  }, []);

  // monta portal
  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      let el = document.getElementById('toast-root') as HTMLElement | null;
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast-root';
        document.body.appendChild(el);
      }
      setContainer(el);
    }
  }, []);

  // sincroniza lista do Provider via evento
  useEffect(() => {
    // “escuta” mudanças internas do Provider disparadas abaixo
    return subscribeToastList(setList);
  }, []);

  if (!mounted || !container) return null;

  return createPortal(
    <div className="fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4 pointer-events-none sm:justify-end sm:px-6">
      <div className="w-full max-w-md space-y-2">
        {list.map((t) => (
          <ToastCard key={t.id} item={t} />
        ))}
      </div>
    </div>,
    container
  );
}

/* ---------- Helpers públicos ---------- */

export function toast(opts: { title?: string; description?: string; image?: string; durationMs?: number }) {
  // dispara um CustomEvent para o Provider cuidar do push
  const event = new CustomEvent('toast:push', { detail: opts });
  if (typeof window !== 'undefined') window.dispatchEvent(event);
}

/* ---------- Infra interna para sync Provider <-> Bridge ---------- */

// Mantém uma cópia da lista atual no Provider e emite eventos
let _providerSetList: React.Dispatch<React.SetStateAction<ToastItem[]>> | null = null;

function subscribeToastList(set: React.Dispatch<React.SetStateAction<ToastItem[]>>) {
  const onSync = (e: Event) => {
    const detail = (e as CustomEvent<ToastItem[]>).detail;
    set(detail);
  };
  window.addEventListener('toast:list', onSync as EventListener);
  return () => window.removeEventListener('toast:list', onSync as EventListener);
}

// Sobrescreve o setList do Provider para emitir eventos
function useSyncListWithBridge(list: ToastItem[], setList: React.Dispatch<React.SetStateAction<ToastItem[]>>) {
  useEffect(() => {
    _providerSetList = setList;
  }, [setList]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const evt = new CustomEvent('toast:list', { detail: list });
      window.dispatchEvent(evt);
    }
  }, [list]);
}

/* ---------- Cartão visual ---------- */

function ToastCard({ item }: { item: ToastItem }) {
  return (
    <div className="pointer-events-auto overflow-hidden rounded-2xl border border-white/10 bg-emerald-500/15 backdrop-blur-md shadow-lg">
      <div className="flex items-start gap-3 p-4">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title || 'Produto adicionado'}
            className="mt-0.5 h-10 w-10 rounded-lg object-cover ring-1 ring-white/10"
          />
        ) : (
          <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
        )}
        <div className="min-w-0">
          {item.title && <p className="text-sm font-medium text-white">{item.title}</p>}
          {item.description && <p className="text-sm text-white/80">{item.description}</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Patch do Provider para emitir eventos de lista ---------- */
// Wrap do Provider original para emitir os eventos (chame dentro de ToastProvider)
const _ToastProviderOrig = ToastProvider;
(ToastProvider as any) = function PatchedToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<ToastItem[]>([]);
  const idRef = useRef(1);

  // sincroniza com o bridge
  useSyncListWithBridge(list, setList);

  useEffect(() => {
    const onPush = (e: Event) => {
      const { title, description, image, durationMs } = (e as CustomEvent<Omit<ToastItem, 'id'>>).detail;
      const id = idRef.current++;
      const duration = durationMs ?? 2800;
      setList((l) => [...l, { id, title, description, image, durationMs: duration }]);
      window.setTimeout(() => {
        setList((l) => l.filter((x) => x.id !== id));
      }, duration);
    };
    window.addEventListener('toast:push', onPush as EventListener);
    return () => window.removeEventListener('toast:push', onPush as EventListener);
  }, []);

  const ctx = useMemo<ToastCtx>(
    () => ({
      push: (t) => {
        const id = idRef.current++;
        const duration = t.durationMs ?? 2800;
        setList((l) => [...l, { ...t, id, durationMs: duration }]);
        window.setTimeout(() => {
          setList((l) => l.filter((x) => x.id !== id));
        }, duration);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* fallback local caso o Bridge não esteja presente */}
      <div className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 pointer-events-none sm:justify-end sm:px-6">
        <div className="w-full max-w-md space-y-2">
          {list.map((t) => (
            <ToastCard key={t.id} item={t} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};