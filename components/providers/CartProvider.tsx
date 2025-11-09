'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ProductLite = {
  id: string | number;
  name: string;
  price: number;
  image?: string | null;
};

export type CartItem = ProductLite & { qty: number };

type CartContextType = {
  items: CartItem[];
  addItem: (p: ProductLite, qty?: number) => void;
  updateQty: (id: CartItem['id'], qty: number) => void;
  removeItem: (id: CartItem['id']) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

const LS_KEY = 'loja-jane:cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // carrega do localStorage no cliente
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(LS_KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persiste
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LS_KEY, JSON.stringify(items));
      }
    } catch {}
  }, [items]);

  const addItem = (p: ProductLite, qty = 1) =>
    setItems(curr => {
      const i = curr.findIndex(it => it.id === p.id);
      if (i >= 0) {
        const next = [...curr];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...curr, { ...p, qty }];
    });

  const updateQty = (id: CartItem['id'], qty: number) =>
    setItems(curr => curr.map(it => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it)));

  const removeItem = (id: CartItem['id']) =>
    setItems(curr => curr.filter(it => it.id !== id));

  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  const value = { items, addItem, updateQty, removeItem, clear, subtotal, count };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}