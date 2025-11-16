// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import CartProviderRoot from "./cart-provider";

export const metadata: Metadata = {
  title: "Loja do Jane",
  description: "Loja do Jane — Ofertas e Moda",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        <CartProviderRoot>{children}</CartProviderRoot>
      </body>
    </html>
  );
}