'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string | null;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  add: (it: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: string | number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // carrega do localStorage (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart:v1');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persiste no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart:v1', JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartContextType['add'] = (it, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => String(p.id) === String(it.id));
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], qty: clone[idx].qty + qty };
        return clone;
      }
      return [...prev, { ...it, qty }];
    });
  };

  const remove: CartContextType['remove'] = (id) =>
    setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));

  const clear = () => setItems([]);

  const { total, count } = useMemo(() => {
    let t = 0;
    let c = 0;
    for (const it of items) {
      t += (Number(it.price) || 0) * (Number(it.qty) || 0);
      c += Number(it.qty) || 0;
    }
    return { total: t, count: c };
  }, [items]);

  const value = useMemo<CartContextType>(
    () => ({ items, add, remove, clear, total, count }),
    [items, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}