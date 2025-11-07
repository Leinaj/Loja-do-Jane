import Image from "next/image";
import { products, money } from "@/lib/products";
import { notFound } from "next/navigation";
import AddToCart from "./parts";

type Props = { params: { slug: string } };

export function generateStaticParams(){
  return products.map(p=>({ slug: p.slug }));
}

export default function ProductPage({params}:Props){
  const p = products.find(x=>x.slug===params.slug);
  if(!p) return notFound();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={p.image} alt={p.title} fill className="object-cover" />
        </div>
      </div>

      <div className="card">
        <h1 className="h1">{p.title}</h1>
        <p className="mt-2 text-emerald-400 text-xl font-bold">{money(p.price)}</p>
        <p className="mt-4 text-zinc-300">{p.description}</p>

        <AddToCart product={p} />
      </div>
    </div>
  )
}