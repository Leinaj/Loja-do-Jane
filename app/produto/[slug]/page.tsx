import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import AddToCart from "./parts/AddToCart";

type Props = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-1/2">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            width={600}
            height={600}
            className="rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-lg opacity-80">{product.description}</p>

          <p className="text-xl font-semibold text-green-500">
            {(product.price / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          <div className="pt-4">
            {/* Aqui o segredo: passamos explicitamente apenas o que o AddToCart precisa */}
            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                slug: product.slug,
                image: product.image,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}