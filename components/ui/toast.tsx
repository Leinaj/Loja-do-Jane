'use client';

import React from 'react';

// Ponte de toast simples (sem libs externas). Use: `toast('Mensagem')`
let listeners: ((msg: string) => void)[] = [];

export function toast(message: string) {
  listeners.forEach(fn => fn(message));
}

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