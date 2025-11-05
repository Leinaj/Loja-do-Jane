import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loja do Jane",
  description: "E-commerce simples em Next.js",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}