export const metadata = { title: "Loja da Jane" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-zinc-100 antialiased">
        <header className="sticky top-0 z-40 backdrop-blur border-b border-zinc-900 bg-black/70">
          <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
            <div className="font-extrabold">Loja da Jane</div>
            <nav className="flex gap-3 text-sm">
              <a className="hover:underline" href="#catalogo">Catálogo</a>
              <a className="hover:underline" href="#contato">Contato</a>
              <a className="btn btn-primary" href="https://wa.me/5544988606483" target="_blank">WhatsApp</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10">
          <p>© 2025 Loja da Jane — feito com amor 💚</p>
        </footer>
      </body>
    </html>
  );
}