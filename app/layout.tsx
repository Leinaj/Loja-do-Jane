import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loja da Jane • PRO",
  description: "Catálogo da Loja da Jane",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        {/* CSS global NA FORÇA BRUTA pra cortar banner e segurar imagens */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* ====== HERO (primeira imagem) ====== */
              body > img:first-of-type,
              main > img:first-of-type {
                width: 100% !important;
                height: 180px !important;         /* mobile */
                object-fit: cover !important;
                display: block !important;
                border-radius: 16px !important;
              }
              /* quando o Next usa <Image>, ele envolve em um <span style="position: relative"> */
              body span[style*="position: relative"]:first-of-type,
              main span[style*="position: relative"]:first-of-type {
                display: block !important;
                width: 100% !important;
                height: 180px !important;         /* mobile */
                max-height: 180px !important;
                overflow: hidden !important;
                border-radius: 16px !important;
              }
              body span[style*="position: relative"]:first-of-type img,
              main span[style*="position: relative"]:first-of-type img {
                object-fit: cover !important;
                inset: 0 !important;
                width: 100% !important;
                height: 100% !important;
              }
              @media (min-width: 640px){
                body > img:first-of-type,
                main > img:first-of-type { height: 260px !important; }
                body span[style*="position: relative"]:first-of-type,
                main span[style*="position: relative"]:first-of-type {
                  height: 260px !important; max-height: 260px !important;
                }
              }
              @media (min-width: 768px){
                body > img:first-of-type,
                main > img:first-of-type { height: 320px !important; }
                body span[style*="position: relative"]:first-of-type,
                main span[style*="position: relative"]:first-of-type {
                  height: 320px !important; max-height: 320px !important;
                }
              }

              /* ====== PRODUTOS (todas as outras imagens) ====== */
              img { max-width: 100% !important; height: auto !important; display: block !important; }
              body img:not(:first-of-type),
              main img:not(:first-of-type) {
                max-height: 340px !important;
                width: 100% !important;
                object-fit: cover !important;
                border-radius: 16px !important;
              }
              /* quando for <Image> do Next (span com position:relative) */
              body span[style*="position: relative"]:not(:first-of-type),
              main span[style*="position: relative"]:not(:first-of-type) {
                display: block !important;
                width: 100% !important;
                max-height: 340px !important;
                overflow: hidden !important;
                border-radius: 16px !important;
              }
              body span[style*="position: relative"]:not(:first-of-type) img,
              main span[style*="position: relative"]:not(:first-of-type) img {
                object-fit: cover !important;
                width: 100% !important;
                height: 100% !important;
              }

              /* ====== largura do conteúdo ====== */
              main { max-width: 1024px !important; margin: 0 auto !important; padding: 0 16px !important; }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}