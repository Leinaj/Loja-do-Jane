import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loja da Jane — Ofertas e Moda",
  description: "Sua loja de moda com ofertas relâmpago e frete rápido.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${outfit.variable} font-sans min-h-screen bg-gradient-to-b from-[#0b1512] via-[#0c1714] to-[#0f1b18] text-zinc-100 antialiased`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          {children}
        </div>

        <footer className="mt-16 border-t border-white/10 py-8 text-center text-sm text-zinc-400">
          © {new Date().getFullYear()} Loja da Jane — todos os direitos reservados
        </footer>
      </body>
    </html>
  );
}