
"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-neutral-200">
      <h1 className="text-2xl font-semibold mb-2">Ops, deu algo errado</h1>
      <p className="text-neutral-400">Tente recarregar a página. Se o problema continuar, fale no WhatsApp.</p>
      <pre className="mt-4 text-xs opacity-60">{error.message}</pre>
    </main>
  );
}
