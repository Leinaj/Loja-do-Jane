"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-2">Algo deu errado</h1>
      <p className="mb-4 text-sm opacity-80">
        Tente novamente. Se o erro persistir, volte para a página inicial.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded bg-black text-white"
      >
        Tentar de novo
      </button>
    </main>
  );
}