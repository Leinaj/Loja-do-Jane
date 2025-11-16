// contexts/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/app/data/products";

export type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === product.id);

      // já existe no carrinho -> soma a quantidade
      if (index >= 0) {
        const clone = [...prev];
        clone[index] = {
          ...clone[index],
          quantity: clone[index].quantity + quantity,
        };
        return clone;
      }

      // não existe -> adiciona
      return [...prev, { ...product, quantity }];
    });
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 1),
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, total, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return ctx;
}