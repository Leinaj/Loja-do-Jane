// components/cart/CartProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Product } from "@/components/products/data";

export type CartItem = {
  id: string; // slug do produto
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

  // salva no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignora erro de storage
    }
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.slug);
      if (exists) return prev; // não duplica por enquanto
      return [
        ...prev,
        {
          id: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const value: CartContextType = { items, total, addItem, removeItem, clear };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 🚨 Versão “segura”: não quebra o build se não tiver provider
export function useCart(): CartContextType {
  const ctx = useContext(CartContext);

  if (!ctx) {
    // fallback usado só em renderização sem provider (build/prerender)
    return {
      items: [],
      total: 0,
      addItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  }

  return ctx;
}