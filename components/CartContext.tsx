// components/CartContext.tsx
"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // em centavos
  image: string;
};

export type CartItem = Product & { qty: number };

type CartContextType = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  getCartCount: () => number;
  getCartTotal: () => number; // em centavos
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add: CartContextType["add"] = (p, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.id === p.id);
      if (i >= 0) {
        const clone = [...prev];
        clone[i] = { ...clone[i], qty: clone[i].qty + qty };
        return clone;
      }
      return [...prev, { ...p, qty }];
    });
  };

  const remove: CartContextType["remove"] = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clear = () => setItems([]);

  const getCartCount = () =>
    items.reduce((sum, it) => sum + it.qty, 0);

  const getCartTotal = () =>
    items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const value = useMemo(
    () => ({ items, add, remove, clear, getCartCount, getCartTotal }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}