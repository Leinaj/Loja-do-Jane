import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import AddToCart from "./parts/AddToCart";

type PageProps = {
  params: { slug: string };
};

// Normaliza qualquer formato vindo do products para o formato esperado pelo app
function normalizeProduct(p: any) {
  return {
    id: String(p.id ?? p.slug ?? p.sku ?? "0"),
    name: String(p.name ?? p.title ?? "Produto"),
    price: Number(p.price ?? 0),
    slug: String(p.slug ?? p.id ?? "produto"),
    image: String(p.image ?? p.img ?? p.photo ?? "/placeholder.png"),
    description: String(p.description ?? p.desc ?? ""),
  };
}

export default function ProductPage({ params }: PageProps) {
  const raw = products.find((p: any) => String(p.slug) === String(params.slug));
  if (!raw) return notFound();

  // Agora usamos sempre o mesmo formato tipado
  const prod = normalizeProduct(raw);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-1/2">
          <Image
            src={prod.image}
            alt={prod.name}
            width={600}
            height={600}
            className="rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">{prod.name}</h1>

          {prod.description && (
            <p className="text-lg opacity-80">{prod.description}</p>
          )}

          <p className="text-xl font-semibold text-green-500">
            {(prod.price / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          <div className="pt-4">
            {/* Passamos exatamente o que o AddToCart espera */}
            <AddToCart
              product={{
                id: prod.id,
                name: prod.name,
                price: prod.price,
                slug: prod.slug,
                image: prod.image,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}