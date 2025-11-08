export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="container py-8 text-sm text-neutral-400">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Loja da Jane — Todos os direitos reservados.</p>
          <p className="text-neutral-500">
            Feito com Next.js + Tailwind · Pix e envio combinados por WhatsApp
          </p>
        </div>
      </div>
    </footer>
  );
}