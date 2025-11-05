import Image from "next/image";
import Link from "next/link";

const products = {
  moletom: { name: "Moletom", price: 159.9, image: "/images/moletom.jpg" },
  bone: { name: "Boné", price: 59.9, image: "/images/bone.jpg" },
} as const;

export default function ProductPage({ params }: { params: { slug: keyof typeof products } }) {
  const p = products[params.slug];
  if (!p) return <main className="p-6">Produto não encontrado.</main>;

  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-100">
      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2">
        {/* imagem SEM ocupar a tela toda */}
        <div className="relative h-80 w-full overflow-hidden rounded-2xl md:h-[28rem]">
          <Image src={p.image} alt={p.name} fill className="object-cover object-center" priority />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="text-2xl text-emerald-400">
            {p.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>

          <div className="flex gap-3">
            <Link href="/" className="rounded-xl border border-zinc-700 px-4 py-2 hover:bg-zinc-800">
              Voltar
            </Link>
            <a
              href="https://wa.me/5544988606483?text=Tenho%20interesse%20em%20um%20produto%20da%20Loja%20da%20Jane"
              target="_blank" rel="noreferrer"
              className="rounded-xl bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}