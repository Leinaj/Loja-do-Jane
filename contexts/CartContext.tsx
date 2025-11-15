"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/components/products/data";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  addToCart: (product: Product, qty: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void; // <- é esse nome que o checkout está usando
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carrega carrinho do localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        // se der erro no parse, zera o carrinho
        setItems([]);
      }
    }
  }, []);

  // Salva carrinho no localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addToCart(product: Product, qty: number) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.product.slug === product.slug ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { product, qty }];
    });
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((i) => i.product.slug !== slug));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce(
    (acc, i) => acc + i.product.price * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, total, addToCart, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be inside CartProvider");
  }
  return ctx;
}