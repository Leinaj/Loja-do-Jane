// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import RootProviders from '@/components/providers/RootProviders';

export const metadata: Metadata = {
  title: 'Loja da Jane — Ofertas e Moda',
  description: 'Sua loja favorita',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}