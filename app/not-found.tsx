import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-2">404 — Página não encontrada</h1>
      <p className="text-gray-400 mb-4">
        Parece que você foi parar num canto vazio da loja 😅
      </p>
      <Link
        href="/"
        className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-xl font-medium transition"
      >
        Voltar para a loja
      </Link>
    </div>
  );
}