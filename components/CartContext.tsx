"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

// Cada item do carrinho
export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (product: Product, quantity = 1) => {
    setItems((prev) => {
      // >>> usamos o slug como identificador único
      const i = prev.findIndex((it) => it.product.slug === product.slug);
      if (i >= 0) {
        const clone = [...prev];
        clone[i] = {
          ...clone[i],
          quantity: clone[i].quantity + quantity,
        };
        return clone;
      }
      return [...prev, { product, quantity }];
    });
  };

  const remove = (slug: string) => {
    setItems((prev) => prev.filter((it) => it.product.slug !== slug));
  };

  const clear = () => setItems([]);

  const count = () => items.reduce((acc, it) => acc + it.quantity, 0);

  const total = () =>
    items.reduce((acc, it) => acc + it.product.price * it.quantity, 0);

  const value = useMemo(
    () => ({ items, add, remove, clear, count, total }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de <CartProvider>");
  }
  return ctx;
}