import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';

export const metadata = {
  title: 'Loja da Jane',
  description: 'Sua loja demo em Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}