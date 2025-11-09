'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

type Ctx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  subtotal: number;
  lastAdded?: CartItem | null;
};

const CartCtx = createContext<Ctx | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  const addItem: Ctx['addItem'] = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + (item.qty ?? 1) };
        setLastAdded(copy[idx]);
        return copy;
        }
      const newItem: CartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: item.qty ?? 1,
      };
      setLastAdded(newItem);
      return [...prev, newItem];
    });
  };

  const setQty: Ctx['setQty'] = (id, qty) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const removeItem: Ctx['removeItem'] = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const value: Ctx = {
    items,
    addItem,
    setQty,
    removeItem,
    clear,
    subtotal,
    lastAdded,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart(): Ctx {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}