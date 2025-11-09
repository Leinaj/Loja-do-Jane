'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: CartItem['id']) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carrega do localStorage no cliente
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('cart_items');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // Salva no localStorage no cliente
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cart_items', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => String(p.id) === String(item.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: (copy[idx].quantity || 0) + (item.quantity || 0),
        };
        return copy;
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (id: CartItem['id']) => {
    setItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => ({ items, addItem, removeItem, clearCart }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart deve ser usado dentro de <CartProvider>');
  }
  return ctx;
}