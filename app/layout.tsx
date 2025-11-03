import "./globals.css";

export const metadata = {
  title: "Loja da Jane",
  description: "Catálogo simples com carrinho e checkout via WhatsApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
