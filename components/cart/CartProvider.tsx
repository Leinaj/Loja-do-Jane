// components/cart/CartProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react";
import type { Product } from "@/components/products/data";

export type CartItem = {
  id: string;    // slug do produto
  name: string;
  price: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "loja-do-jane-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // toda vez que o carrinho muda, salva no localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // se der erro, só ignora
    }
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.slug);
      if (exists) return prev; // não duplica, por enquanto sem quantidade
      return [
        ...prev,
        {
          id: product.slug,
          name: product.name,
          price: product.price,
          image: product.image
        }
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, total, addItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}