// ... seus imports
import CartNotice from '@/components/CartNotice';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-950 text-white">
        {/* SEU provider de carrinho já existente aqui (se houver) */}
        {children}
        {/* Aviso global de “adicionado ao carrinho” */}
        <CartNotice />
      </body>
    </html>
  );
}