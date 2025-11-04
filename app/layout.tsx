export const metadata = {
  title: 'Loja da Jane',
  description: 'Catálogo simples com carrinho e checkout no WhatsApp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-900 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
