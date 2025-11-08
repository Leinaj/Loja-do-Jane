import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers'; // client boundary

export const metadata: Metadata = {
  title: 'Loja da Jane',
  description: 'Sua loja online :)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-neutral-950 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}