import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Loja da Jane",
  description: "E-commerce simples da Loja da Jane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-950 text-neutral-50 antialiased">
        {children}
        {/* Métricas da Vercel */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}