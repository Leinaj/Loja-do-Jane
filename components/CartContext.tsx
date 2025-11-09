'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

type Ctx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  lastAdded?: CartItem | null;
};

const CartContext = createContext<Ctx | null>(null);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  const addItem: Ctx['addItem'] = (item, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        setLastAdded(next[idx]);
        return next;
      }
      const newItem: CartItem = { ...item, qty };
      setLastAdded(newItem);
      return [...prev, newItem];
    });
  };

  const remove: Ctx['remove'] = (id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const setQty: Ctx['setQty'] = (id, qty) => {
    setItems(prev => prev.map(p => (p.id === id ? { ...p, qty } : p)));
  };

  const clear = () => {
    setItems([]);
    setLastAdded(null);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items]
  );

  const value: Ctx = { items, addItem, remove, setQty, clear, subtotal, lastAdded };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}