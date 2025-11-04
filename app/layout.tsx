// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Loja da Jane";
const baseUrl  = "https://loja-do-jane.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description:
    "Moda básica que combina com tudo. Entregas rápidas, pagamento por Pix e Cartão. Fale com a gente no WhatsApp.",
  keywords: ["roupas", "camiseta", "moletom", "boné", "loja", "Maringá"],
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName,
    title: siteName,
    description:
      "Moda básica que combina com tudo. Entregas rápidas, pagamento por Pix e Cartão.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description:
      "Moda básica que combina com tudo. Entregas rápidas, pagamento por Pix e Cartão.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950">{children}</body>
    </html>
  );
}
