// components/cart/context.tsx
'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, qty: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => void;
  coupon?: string | null;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);

  // carrega do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart:v1');
      if (raw) setItems(JSON.parse(raw));
      const c = localStorage.getItem('cart:coupon');
      if (c) setCoupon(c);
    } catch {}
  }, []);

  // salva
  useEffect(() => {
    try {
      localStorage.setItem('cart:v1', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem: CartCtx['addItem'] = (item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], quantity: clone[idx].quantity + qty };
        return clone;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const updateItemQuantity = (id: string, qty: number) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);
  const applyCoupon = (code: string) => {
    setCoupon(code);
    try {
      localStorage.setItem('cart:coupon', code);
    } catch {}
  };

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateItemQuantity, clear, applyCoupon, coupon }),
    [items, coupon]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>');
  return ctx;
}