// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">
          Loja do Jane
        </Link>
        <nav className="flex gap-3 text-sm">
          <Link href="/" className="rounded px-3 py-2 hover:bg-zinc-900">Início</Link>
          <Link href="/catalogo" className="rounded px-3 py-2 hover:bg-zinc-900">Catálogo</Link>
          <Link href="/contato" className="rounded px-3 py-2 hover:bg-zinc-900">Contato</Link>
        </nav>
      </div>
    </header>
  );
}
