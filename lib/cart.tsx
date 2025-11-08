'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string | number) => void;
  clear: () => void;
  setQuantity: (id: string | number, quantity: number) => void;
  total: number;
  itemsCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // carregar do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart:v1');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart:v1', JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (item: CartItem) => {
    setItems((curr) => {
      const idx = curr.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const copy = [...curr];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity };
        return copy;
      }
      return [...curr, item];
    });
  };

  const remove = (id: string | number) => {
    setItems((curr) => curr.filter((i) => i.id !== id));
  };

  const clear = () => setItems([]);

  const setQuantity = (id: string | number, quantity: number) => {
    setItems((curr) =>
      curr.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)),
    );
  };

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items],
  );

  const itemsCount = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items],
  );

  const value: CartContextType = { items, add, remove, clear, setQuantity, total, itemsCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}