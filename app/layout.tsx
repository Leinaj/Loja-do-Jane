import "./globals.css";
import type { Metadata } from "next";
import CartProvider from "@/components/CartContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Loja da Jane",
  description: "Sua loja online — simples e rápida",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-zinc-100">
        <CartProvider>
          <Header />
          <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
          <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-400">
            © {new Date().getFullYear()} Loja da Jane — feito com amor 💚
            <div className="mt-2">
              WhatsApp: <a className="underline" href="https://wa.me/5544988606483">+55 (44) 98860-6483</a>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}