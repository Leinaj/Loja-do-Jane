import Image from "next/image";
import Link from "next/link";
import { brl } from "@/lib/products";

type Props = { title: string; price: number; image: string; href?: string };

export default function ProductCard({ title, price, image, href }: Props) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
      <div className="overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={title}
          width={800}
          height={600}
          sizes="(max-width: 640px) 100vw, 600px"
          className="aspect-[4/3] h-auto w-full object-cover"
          priority
        />
      </div>
      <div className="mt-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-emerald-400">{brl(price)}</p>
        <div className="mt-3 flex gap-3">
          <button className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500">
            Adicionar
          </button>
          <Link
            href={href ?? "#"}
            className="rounded-xl border border-zinc-700 px-4 py-2 font-medium hover:bg-zinc-800"
          >
            Ver
          </Link>
        </div>
      </div>
    </article>
  );
}