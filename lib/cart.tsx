'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = { id: string; name: string; price: number; image?: string; qty: number; };
type Ctx = {
  items: CartItem[];
  add: (item: Omit<CartItem,'qty'>, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setQty: (id: string, qty: number) => void;
  lastAdded?: { name: string };
};

const CartCtx = createContext<Ctx | null>(null);
const LS_KEY = 'cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<{ name: string }>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const add: Ctx['add'] = (item, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i >= 0) {
        const cp = [...prev]; cp[i] = { ...cp[i], qty: cp[i].qty + qty };
        return cp;
      }
      return [...prev, { ...item, qty }];
    });
    setLastAdded({ name: item.name });
  };

  const remove: Ctx['remove'] = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const clear  : Ctx['clear']  = () => setItems([]);
  const setQty : Ctx['setQty'] = (id, qty) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));

  const value = useMemo(() => ({ items, add, remove, clear, setQty, lastAdded }), [items, lastAdded]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}