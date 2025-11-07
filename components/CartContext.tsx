"use client";
import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import { Product } from "@/lib/products";

type CartItem = { product: Product; qty: number };
type CartState = {
  items: CartItem[];
  count: number;
  total: number; // cents
  add: (p: Product, q?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setQty: (id: string, qty: number) => void;
};

const Ctx = createContext<CartState | null>(null);

export const CartProvider = ({children}:{children:React.ReactNode}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // hidrata do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart_v1");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("cart_v1", JSON.stringify(items));
  }, [items]);

  const api: CartState = useMemo(() => {
    const count = items.reduce((s,i)=>s+i.qty,0);
    const total = items.reduce((s,i)=>s+i.qty*i.product.price,0);
    return {
      items, count, total,
      add: (p,q=1)=> {
        setItems(prev=>{
          const i = prev.findIndex(x=>x.product.id===p.id);
          if (i>=0) {
            const clone=[...prev]; clone[i]={...clone[i], qty: clone[i].qty+q}; return clone;
          }
          return [...prev, {product:p, qty:q}];
        });
      },
      remove: (id)=> setItems(prev=>prev.filter(x=>x.product.id!==id)),
      clear: ()=> setItems([]),
      setQty: (id,qty)=> setItems(prev=>prev.map(x=>x.product.id===id? {...x, qty: Math.max(1, qty)}:x))
    }
  },[items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useCart = () => {
  const ctx = useContext(Ctx);
  if(!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}