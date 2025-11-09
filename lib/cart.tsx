'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
};

type Ctx = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;     // ✅ aqui
  clear: () => void;
  subtotal: number;
};

const CartContext = createContext<Ctx | null>(null);
const STORAGE_KEY = 'cart:v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // hidratar do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persistir no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const ix = prev.findIndex((p) => p.id === item.id);
      if (ix >= 0) {
        const next = [...prev];
        next[ix] = { ...next[ix], qty: next[ix].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  }

  function setQty(id: string, qty: number) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
    );
  }

  // ✅ remove implementado
  function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  );

  const value: Ctx = { items, addItem, setQty, remove, clear, subtotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}