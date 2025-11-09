'use client';

import React from 'react';

// API simples de toast
let listeners: Array<(msg: string) => void> = [];

export function toast(message: string) {
  listeners.forEach(fn => fn(message));
}

// Componente visual do toast (fica montado globalmente)
export function ToastBridge() {
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    const on = (m: string) => {
      setMsg(m);
      const t = setTimeout(() => setMsg(null), 2500);
      return () => clearTimeout(t);
    };
    listeners.push(on);
    return () => {
      listeners = listeners.filter(l => l !== on);
    };
  }, []);

  if (!msg) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 bg-emerald-600 text-white shadow-lg">
      {msg}
    </div>
  );
}

// ✅ Provider compatível com o import usado no seu projeto
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastBridge />
    </>
  );
}