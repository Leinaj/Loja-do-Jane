import Image from "next/image";
import Link from "next/link";
import { Product, money } from "@/lib/products";

export default function ProductCard({p}:{p:Product}){
  return (
    <div className="card">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image src={p.image} alt={p.title} fill className="object-cover" />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{p.title}</h3>
          <p className="small">{money(p.price)}</p>
        </div>
        <Link href={`/produto/${p.slug}`} className="btn">Ver produto</Link>
      </div>
    </div>
  );
}