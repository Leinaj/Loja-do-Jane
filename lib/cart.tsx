'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string | number;
  name: string;
  price: number;          // em centavos ou número normal – aqui tratamos como número normal (ex: 159.9)
  image?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: CartItem['id']) => void;
  setQty: (id: CartItem['id'], qty: number) => void;
  clear: () => void;
  subtotal: number; // soma de price * quantity
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'jdj:cart:v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // hidrata do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // salva no localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addItem: CartContextType['addItem'] = (incoming) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => String(p.id) === String(incoming.id));
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = {
          ...clone[idx],
          quantity: clone[idx].quantity + incoming.quantity,
        };
        return clone;
      }
      return [...prev, incoming];
    });
  };

  const removeItem: CartContextType['removeItem'] = (id) => {
    setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const setQty: CartContextType['setQty'] = (id, qty) => {
    setItems((prev) =>
      prev.map((p) =>
        String(p.id) === String(id) ? { ...p, quantity: Math.max(1, qty) } : p
      )
    );
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.quantity, 0),
    [items]
  );

  const value: CartContextType = { items, addItem, removeItem, setQty, clear, subtotal };

  // evita piscar conteúdo antes de hidratar
  if (!hydrated) return null;

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}