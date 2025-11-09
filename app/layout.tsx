import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Loja da Jane — Ofertas e Moda',
  description: 'Até 50% OFF em itens selecionados.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* ✅ Todos os componentes (home, produto, checkout) agora estão dentro do CartProvider e ToastProvider */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}