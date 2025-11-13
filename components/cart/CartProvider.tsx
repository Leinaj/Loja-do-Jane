// components/cart/CartProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  addToCart: (item: CartItem) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carrega do localStorage (se existir)
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("cart");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
    }
  }, []);

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (err) {
      console.error("Erro ao salvar carrinho:", err);
    }
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((current) => {
      const existing = current.find((p) => p.slug === item.slug);
      if (existing) {
        // se já existe, só soma a quantidade
        return current.map((p) =>
          p.slug === item.slug
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      // se não existe, adiciona
      return [...current, item];
    });
  };

  const removeItem = (slug: string) => {
    setItems((current) => current.filter((p) => p.slug !== slug));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, total, addToCart, removeItem, clearCart }}
    >
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