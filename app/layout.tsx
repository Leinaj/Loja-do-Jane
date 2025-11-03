export const metadata = {
  title: 'Loja da Jane',
  description: 'Catálogo simples com carrinho e WhatsApp',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-900 text-zinc-100 antialiased">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
