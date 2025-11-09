// app/layout.tsx
import type { Metadata } from 'next';
import RootProviders from '@/components/providers/RootProviders';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'Loja da Jane — Ofertas e Moda',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <RootProviders>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </RootProviders>
      </body>
    </html>
  );
}