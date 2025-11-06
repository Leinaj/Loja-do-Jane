"use client";

type Props = { pix: string };

export default function PixCopy({ pix }: Props) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(pix);
      alert("Chave PIX copiada!");
    } catch {
      alert("Não foi possível copiar agora.");
    }
  }

  return (
    <div className="inline-flex items-center gap-3">
      <code className="rounded bg-zinc-800 px-2 py-1">{pix}</code>
      <button
        onClick={copy}
        className="rounded-xl border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-800"
      >
        Copiar chave
      </button>
    </div>
  );
}