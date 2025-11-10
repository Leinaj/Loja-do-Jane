// app/layout.tsx
import './globals.css';
import CartProviderClient from './cart-provider';

export const metadata = {
  title: 'Loja do Jane — Ofertas e Moda',
  description: 'Moda e estilo com os melhores preços!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProviderClient>{children}</CartProviderClient>
      </body>
    </html>
  );
}