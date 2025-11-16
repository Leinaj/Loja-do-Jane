// app/cart-provider.tsx
"use client";

import { CartProvider } from "@/contexts/CartContext";

export default function CartProviderRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}