import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, priceBRL } from "@/lib/products";
import AddToCart from "./parts/AddToCart";

type Props = { params: { slug: string } };

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative w-full aspect-[16/12] rounded-2xl overflow-hidden border border-zinc-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-emerald-400 text-xl">{priceBRL(product.price)}</p>
        <p className="text-zinc-300">{product.description}</p>

        <AddToCart product={product} />
      </div>
    </div>
  );
}