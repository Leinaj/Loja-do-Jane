import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loja da Jane — Catálogo com carrinho",
  description: "Camisetas, moletons e mais. Pagamento por Pix e Cartão. Fale no WhatsApp.",
  openGraph: {
    title: "Loja da Jane",
    description: "Camisetas, moletons e mais. Pix e Cartão.",
    url: "https://loja-do-jane.vercel.app",
    siteName: "Loja da Jane",
    images: [{ url: "/banner.jpg", width: 1200, height: 630, alt: "Loja da Jane" }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loja da Jane",
    description: "Camisetas, moletons e mais. Pix e Cartão.",
    images: ["/banner.jpg"],
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
