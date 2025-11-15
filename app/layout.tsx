import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import CartProvider from "./cart-provider";

export const metadata: Metadata = {
  title: "Loja do Jane",
  description: "Loja do Jane - sua loja online",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-zinc-50">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}