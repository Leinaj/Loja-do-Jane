import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loja da Jane",
  description: "Loja simples e rápida com Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
