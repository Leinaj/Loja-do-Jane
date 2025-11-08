import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Loja da Jane — Ofertas e Moda',
  description:
    'Descubra ofertas relâmpago e novidades em moda na Loja da Jane. Pague no PIX, cartão ou boleto.',
  metadataBase: new URL('https://loja-do-jane.vercel.app'),
  openGraph: {
    title: 'Loja da Jane — Ofertas e Moda',
    description:
      'Descubra ofertas relâmpago e novidades em moda na Loja da Jane.',
    url: 'https://loja-do-jane.vercel.app',
    siteName: 'Loja da Jane',
    images: [{ url: '/banner.webp', width: 1200, height: 630, alt: 'Promo relâmpago na Loja da Jane' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loja da Jane — Ofertas e Moda',
    description:
      'Descubra ofertas relâmpago e novidades em moda na Loja da Jane.',
    images: ['/banner.webp'],
  },
  icons: { icon: '/favicon.ico' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-950 text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}