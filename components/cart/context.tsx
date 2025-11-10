'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

type Ctx = {
  items: CartItem[];
  addItem: (item: CartItem, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => void;
  setShipping: (v: number) => void;

  coupon: string | null;
  shipping: number;
  subtotal: number;
  discount: number;
  total: number;

  // 🔥 novo campo para o toast
  lastAdded: CartItem | null;
};

const CartContext = createContext<Ctx | null>(null);
const LS_KEY = 'jane.cart.v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [shipping, setShipping] = useState<number>(0);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  // carregar localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.items)) setItems(data.items);
        if (data.coupon) setCoupon(data.coupon);
        if (typeof data.shipping === 'number') setShipping(data.shipping);
      }
    } catch {}
  }, []);

  // salvar localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ items, coupon, shipping }));
    } catch {}
  }, [items, coupon, shipping]);

  const addItem: Ctx['addItem'] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      let updated;
      if (existing) {
        updated = prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + qty } : p
        );
      } else {
        updated = [...prev, { ...item, qty }];
      }
      setLastAdded({ ...item, qty }); // 🔥 salva o último adicionado
      return updated;
    });
  };

  const updateQty: Ctx['updateQty'] = (id, qty) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty } : p)).filter((p) => p.qty > 0)
    );

  const removeItem: Ctx['removeItem'] = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clear: Ctx['clear'] = () => {
    setItems([]);
    setCoupon(null);
    setShipping(0);
  };

  const applyCoupon: Ctx['applyCoupon'] = (code) => {
    setCoupon(code.trim().toUpperCase() || null);
  };

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.qty, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (coupon === 'JANE10') return subtotal * 0.1;
    return 0;
  }, [coupon, subtotal]);

  const total = useMemo(
    () => Math.max(0, subtotal - discount) + (shipping || 0),
    [subtotal, discount, shipping]
  );

  const value: Ctx = {
    items,
    addItem,
    updateQty,
    removeItem,
    clear,
    applyCoupon,
    setShipping,
    coupon,
    shipping,
    subtotal,
    discount,
    total,
    lastAdded, // ✅ agora existe!
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>');
  return ctx;
}