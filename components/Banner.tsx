// components/Banner.tsx
export default function Banner() {
  return (
    <section className="mx-auto mt-6 max-w-6xl px-4">
      <div className="overflow-hidden rounded-3xl border border-zinc-800">
        {/* Se /public/banner.jpg não existir, fica só o degradê de fundo */}
        <div
          className="relative aspect-[16/6] w-full bg-gradient-to-r from-emerald-700/30 via-zinc-900 to-emerald-700/30"
          style={{
            backgroundImage: "url(/banner.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="grid gap-4 p-6 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              iPhone 6 <span className="text-emerald-400">Plus</span>
            </h1>
            <p className="mt-1 text-zinc-400">
              Para trocar o banner, coloque um arquivo em
              <code className="ml-2 rounded bg-zinc-800 px-2 py-0.5 text-zinc-200">
                /public/banner.jpg
              </code>
              .
            </p>
          </div>

          <a
            href="#produtos"
            className="rounded-xl bg-emerald-600 px-5 py-3 text-center font-medium text-white hover:bg-emerald-500"
          >
            Ver produtos
          </a>

          <a
            href="https://wa.me/5544988606483?text=Olá,%20quero%20finalizar%20minha%20compra"
            target="_blank"
            className="rounded-xl border border-zinc-700 px-5 py-3 text-center font-medium text-zinc-100 hover:bg-zinc-800"
          >
            Finalizar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}