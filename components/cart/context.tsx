'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;     // preço unitário (em reais)
  image?: string;
  qty: number;
};

type Ctx = {
  items: CartItem[];

  addItem: (item: CartItem, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;

  // cupom, frete e totais
  coupon: string | null;
  applyCoupon: (code: string) => void;
  shipping: number;
  setShipping: (value: number) => void;

  subtotal: number;  // soma dos itens
  discount: number;  // valor de desconto aplicado
  total: number;     // subtotal - desconto + frete
};

const CartContext = createContext<Ctx | null>(null);
const LS_KEY = 'jane.cart.v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [shipping, setShipping] = useState<number>(0);

  // hidrata do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setItems(Array.isArray(data.items) ? data.items : []);
        setCoupon(data.coupon ?? null);
        setShipping(typeof data.shipping === 'number' ? data.shipping : 0);
      }
    } catch {}
  }, []);

  // persiste no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ items, coupon, shipping })
      );
    } catch {}
  }, [items, coupon, shipping]);

  const addItem: Ctx['addItem'] = (item, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === item.id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], qty: clone[idx].qty + qty };
        return clone;
      }
      return [...prev, { ...item, qty }];
    });
  };

  const updateQty: Ctx['updateQty'] = (id, qty) => {
    setItems(prev =>
      prev
        .map(p => (p.id === id ? { ...p, qty } : p))
        .filter(p => p.qty > 0)
    );
  };

  const removeItem: Ctx['removeItem'] = id => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const clear: Ctx['clear'] = () => {
    setItems([]);
    // mantém cupom/frete; se quiser limpar tudo:
    // setCoupon(null); setShipping(0);
  };

  const applyCoupon: Ctx['applyCoupon'] = code => {
    // Exemplo simples: JANE10 = 10% OFF
    setCoupon(code.trim().toUpperCase() || null);
  };

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.qty, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon === 'JANE10') return subtotal * 0.1;
    return 0;
  }, [coupon, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount) + (shipping || 0);
  }, [subtotal, discount, shipping]);

  const value: Ctx = {
    items,
    addItem,
    updateQty,
    removeItem,
    clear,

    coupon,
    applyCoupon,
    shipping,
    setShipping,

    subtotal,
    discount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart precisa estar dentro de <CartProvider>');
  }
  return ctx;
}