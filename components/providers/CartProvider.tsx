'use client';

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type ProductLite = {
  id: string | number;
  name: string;
  price: number;       // ex.: 159.9
  image?: string;
};

export type CartItem = ProductLite & { qty: number };

type CartContextType = {
  items: CartItem[];
  addItem: (p: ProductLite, qty?: number) => void;
  removeItem: (id: string | number) => void;
  clear: () => void;
  getCount: () => number;
  getTotal: () => number;
};

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (p: ProductLite, qty = 1) =>
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === p.id);
      if (idx >= 0) {
        const cp = [...prev];
        cp[idx] = { ...cp[idx], qty: cp[idx].qty + qty };
        return cp;
      }
      return [...prev, { ...p, qty }];
    });

  const removeItem = (id: string | number) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);
  const getCount = () => items.reduce((a, i) => a + i.qty, 0);
  const getTotal = () => items.reduce((a, i) => a + i.qty * i.price, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clear, getCount, getTotal }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}