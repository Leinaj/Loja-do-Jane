"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

type CartItem = { product: Product; qty: number };

type CartContextType = {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
};

const CartContext = createContext<CartContextType | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add: CartContextType["add"] = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.product.id === product.id);
      if (i >= 0) {
        const clone = [...prev];
        clone[i] = { ...clone[i], qty: clone[i].qty + qty };
        return clone;
      }
      return [...prev, { product, qty }];
    });
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((it) => it.product.id !== id));

  const clear = () => setItems([]);

  const getCartCount = () => items.reduce((acc, it) => acc + it.qty, 0);

  const getCartTotal = () =>
    Number(items.reduce((acc, it) => acc + it.qty * it.product.price, 0).toFixed(2));

  const value = useMemo(
    () => ({ items, add, remove, clear, getCartCount, getCartTotal }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro do CartProvider");
  return ctx;
};