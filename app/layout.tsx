// app/layout.tsx
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";

export const metadata = {
  title: "Loja da Jane — Ofertas e Moda",
  description: "Sua loja simples e rápida!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-black text-white">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}