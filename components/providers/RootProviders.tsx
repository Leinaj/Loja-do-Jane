"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/lib/cart";
import { ToastContainer } from "@/components/ui/toast";

export default function RootProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      {/* Avisos globais */}
      <ToastContainer />
    </CartProvider>
  );
}