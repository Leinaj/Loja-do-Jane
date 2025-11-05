// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Loja da Jane",
  description: "Sua loja simples e segura com pagamento por PIX e Cartão.",
  metadataBase: new URL("https://loja-do-jane.vercel.app"),
  openGraph: {
    title: "Loja da Jane",
    description: "Compre fácil, pague no PIX e receba em Maringá/PR.",
    url: "https://loja-do-jane.vercel.app",
    siteName: "Loja da Jane",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
