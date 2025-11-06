import PixCopy from "@/components/PixCopy";

export default function ContatoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Contato</h1>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="mb-5">
          <p className="mb-1 text-sm text-zinc-400">WhatsApp</p>
          <a
            href="https://wa.me/5544988606483"
            target="_blank"
            className="inline-block border-b-2 border-emerald-500 pb-0.5 text-lg font-medium text-emerald-400"
          >
            +55 (44) 98860-6483
          </a>
        </div>

        <div>
          <p className="mb-2 text-sm text-zinc-400">Chave PIX</p>
          <PixCopy pix="44988606483" />
        </div>
      </section>
    </main>
  );
}