"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/contexts/CartContext";

export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}