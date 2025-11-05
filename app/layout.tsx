export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-zinc-100">
        {children}
        <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-400">
          © {new Date().getFullYear()} Loja da Jane — feito com amor 💚
        </footer>
      </body>
    </html>
  );
}