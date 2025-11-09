// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Loja da Jane — Ofertas e Moda',
  description: 'E-commerce da Jane',
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}