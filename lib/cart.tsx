'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type CartItem = {
  id: string;        // sempre string
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setQuantity: (id: string, qty: number) => void;
  getCartTotal: () => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'cart:v1';

function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      setItems(readStorage());
      loaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (loaded.current) writeStorage(items);
  }, [items]);

  const add: CartContextValue['add'] = (item, qty = 1) => {
    setItems((prev) => {
      const id = String(item.id);
      const found = prev.find((i) => i.id === id);
      if (found) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + Math.max(1, qty) } : i
        );
      }
      return [
        ...prev,
        {
          id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: Math.max(1, qty),
        },
      ];
    });
  };

  const remove: CartContextValue['remove'] = (id) => {
    setItems((prev) => prev.filter((i) => (i.id === String(id) ? false : true)));
  };

  const clear: CartContextValue['clear'] = () => setItems([]);

  const setQuantity: CartContextValue['setQuantity'] = (id, qty) => {
    const q = Math.max(1, Math.floor(qty));
    setItems((prev) => prev.map((i) => (i.id === String(id) ? { ...i, quantity: q } : i)));
  };

  const getCartTotal = useMemo(
    () => () => items.reduce((acc, it) => acc + it.price * it.quantity, 0),
    [items]
  );

  const value: CartContextValue = { items, add, remove, clear, setQuantity, getCartTotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}