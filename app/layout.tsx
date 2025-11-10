// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Loja da Jane — Ofertas e Moda',
  description: 'Sua loja demo com carrinho e checkout.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-950 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}