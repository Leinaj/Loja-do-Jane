"use client";
import { useState } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/components/CartContext";

export default function AddToCart({product}:{product:Product}){
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button className="btn-outline w-10" onClick={()=>setQty(q=>Math.max(1,q-1))}>-</button>
        <input className="input w-16 text-center" value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value)||1))}/>
        <button className="btn-outline w-10" onClick={()=>setQty(q=>q+1)}>+</button>
      </div>
      <button className="btn" onClick={()=>add(product, qty)}>Adicionar ao carrinho</button>
    </div>
  );
}