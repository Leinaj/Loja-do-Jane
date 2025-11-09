import type { Metadata } from 'next';
import './globals.css';
import RootProviders from '@/components/providers/RootProviders';

export const metadata: Metadata = {
  title: 'Loja da Jane — Ofertas e Moda',
  description: 'Até 50% OFF em itens selecionados.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* ✅ Providers no nível raiz — cobre TODAS as rotas */}
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}