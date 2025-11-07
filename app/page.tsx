"use client";

export default function Page() {
  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText("44988606483");
      alert("Chave PIX copiada!");
    } catch {
      alert("Não deu pra copiar. Chave: 44988606483");
    }
  };

  return (
    <main className="container mx-auto max-w-5xl p-4 space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-400 p-8 text-white">
        <h1 className="text-3xl font-extrabold">Loja da Jane — CLEAN BUILD ✅</h1>
        <p className="opacity-90">Se você está vendo isso, o deploy novo pegou.</p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { nome: "Moletom", preco: "R$ 159,90" },
          { nome: "Boné", preco: "R$ 59,90" },
          { nome: "Camiseta", preco: "R$ 49,90" },
        ].map((p) => (
          <article key={p.nome} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="aspect-[4/3] w-full rounded-xl bg-zinc-800 mb-3" />
            <h3 className="text-lg font-semibold">{p.nome}</h3>
            <p className="text-emerald-400 font-bold">{p.preco}</p>
            <button className="mt-3 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white">
              Ver
            </button>
          </article>
        ))}
      </section>

      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <h2 className="text-xl font-bold">Pagamento & Contato</h2>
        <div className="flex flex-wrap items-center gap-3">
          <a className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white" href="https://wa.me/5544988606483" target="_blank">
            WhatsApp
          </a>
          <code className="rounded-xl bg-zinc-800 px-3 py-2">44988606483</code>
          <button onClick={copyPix} className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-white">
            Copiar chave
          </button>
        </div>
      </section>

      <footer className="text-center text-zinc-400 pb-6">© 2025 Loja da Jane — feito com amor 💚</footer>
    </main>
  );
}