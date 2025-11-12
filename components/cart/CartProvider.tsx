'use client';

import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartCtx = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        // se já existe, só soma a quantidade
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }

      return [...prev, item];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    total,
    addItem,
    removeItem,
    clearCart,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return ctx;
}