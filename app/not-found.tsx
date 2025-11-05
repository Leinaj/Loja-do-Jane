import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-3">404 — Página não encontrada</h1>
      <Link className="underline" href="/">Voltar para a loja</Link>
    </main>
  );
}