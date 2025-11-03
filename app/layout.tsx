export const metadata = {
  title: 'Loja da Jane',
  description: 'Catálogo simples com carrinho e WhatsApp',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: '#0b0b0b', color: '#fff', fontFamily: 'system-ui, Arial' }}>
        {children}
      </body>
    </html>
  );
}
