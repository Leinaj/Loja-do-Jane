import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { CartProvider } from '@/lib/cart';

export const metadata: Metadata = {
  title: 'Loja da Jane',
  description: 'Loja simples em Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* O provider precisa envolver TUDO que usa useCart, inclusive o Header */}
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}