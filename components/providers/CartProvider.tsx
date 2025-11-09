'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = {
  id: string | number;
  name: string;
  price: number;         // em reais (ex.: 159.9)
  image?: string;
  quantity: number;      // quantidade no carrinho
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (id: CartItem['id']) => void;
  clear: () => void;
  getTotal: () => number;          // subtotal em reais
  getCount: () => number;          // total de itens
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem: CartContextType['addItem'] = (item, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === item.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], quantity: copy[i].quantity + qty };
        return copy;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem: CartContextType['removeItem'] = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  const getTotal = () =>
    items.reduce((sum, it) => sum + (Number(it.price) || 0) * it.quantity, 0);

  const getCount = () => items.reduce((sum, it) => sum + it.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clear, getTotal, getCount }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
};