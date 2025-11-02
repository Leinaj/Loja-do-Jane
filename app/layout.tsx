import "./globals.css";

export const metadata = {
  title: "Loja da Jane",
  description: "Site profissional com catálogo, carrinho e checkout simulado.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
