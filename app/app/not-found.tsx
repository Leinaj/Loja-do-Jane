// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">Página não encontrada</h1>
      <p className="mt-3 text-zinc-400">O link pode ter mudado ou nunca existiu.</p>
      <div className="mt-6">
        <Link href="/" className="rounded-xl border border-zinc-700 px-5 py-3 font-medium hover:bg-zinc-900">
          Voltar para a Home
        </Link>
      </div>
    </main>
  );
}