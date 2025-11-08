"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/lib/cart";

export default function RootProviders({ children }: { children: ReactNode }) {
  // Aqui você pode incluir outros providers no futuro (tema, auth, etc.)
  return <CartProvider>{children}</CartProvider>;
}