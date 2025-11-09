'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(newItem: CartItem) {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === newItem.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + newItem.qty };
        return next;
      }
      return [...prev, newItem];
    });
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(p => p.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const value = useMemo(
    () => ({ items, addItem, removeItem, clear }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}