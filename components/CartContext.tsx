"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  slug: string;
  image?: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (product: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  getCartCount: () => number;
  total: () => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // carrega do localStorage no cliente
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // persiste alterações
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartContextValue["add"] = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === product.id);
      if (i >= 0) {
        const clone = [...prev];
        clone[i] = { ...clone[i], qty: clone[i].qty + qty };
        return clone;
        }
      return [...prev, { ...product, qty }];
    });
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clear = () => setItems([]);

  const getCartCount = () => items.reduce((sum, i) => sum + i.qty, 0);

  const total = () => items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const value = useMemo(
    () => ({ items, add, remove, clear, getCartCount, total }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro do CartProvider");
  return ctx;
}