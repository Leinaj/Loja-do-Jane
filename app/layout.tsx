// app/layout.tsx
import './globals.css'; // <- IMPORTANTE: garante os estilos
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Loja da Jane — Ofertas e Moda',
  description: 'Ofertas com até 50% OFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}