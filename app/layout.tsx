import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Loja da Jane",
  description: "Catálogo da Loja da Jane",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <CartProvider>
          <Header />
          <main className="container py-8">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}