import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loja da Jane",
  description: "Catálogo da Loja da Jane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        {/* CSS global forçado (sem depender de classes do HTML) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Banner (primeira imagem da página) */
              body > img:first-of-type,
              main > img:first-of-type {
                width: 100%;
                height: 180px;             /* mobile */
                object-fit: cover;
                display: block;
                border-radius: 16px;
              }
              @media (min-width: 640px){
                body > img:first-of-type,
                main > img:first-of-type { height: 260px; }
              }
              @media (min-width: 768px){
                body > img:first-of-type,
                main > img:first-of-type { height: 320px; }
              }

              /* Todas as outras imagens (produtos) */
              img { max-width: 100%; height: auto; display: block; }
              body img:not(:first-of-type),
              main img:not(:first-of-type) {
                max-height: 340px;         /* limita a altura */
                object-fit: cover;
                border-radius: 16px;
              }

              /* Centraliza o conteúdo se houver <main> */
              main { max-width: 1024px; margin: 0 auto; padding: 0 16px; }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}