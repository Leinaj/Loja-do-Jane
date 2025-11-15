import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Loja da Jane — Ofertas e Moda",
  description: "Ofertas de moda com compra via WhatsApp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}