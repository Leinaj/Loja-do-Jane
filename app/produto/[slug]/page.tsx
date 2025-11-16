// app/produto/[slug]/page.tsx
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { products } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Acha o produto pelo slug
  const product = useMemo(
    () => products.find((p) => p.slug === slug),
    [slug]
  );

  function formatPrice(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Se não achou o produto, mostra uma telinha 404 estilosa
  if (!product) {
    return (
      <main className="px-4 py-10 text-center text-gray-100">
        <h1 className="text-2xl font-semibold mb-3">Produto não encontrado</h1>
        <p className="mb-6 text-gray-400">
          Parece que esse item saiu da vitrine.
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-medium text-black hover:bg-emerald-400 transition"
        >
          Voltar para a loja
        </button>
      </main>
    );
  }

  function handleAddToCart() {
    if (!product) return;

    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        description: product.description,
        image: product.image,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleGoToCart() {
    if (!product) return;
    if (!added) {
      handleAddToCart();
    }
    router.push("/checkout");
  }

  return (
    <main className="px-4 pb-24 pt-6">
      {/* Imagem do produto */}
      <div className="rounded-2xl overflow-hidden mb-4 bg-black/40">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Título e descrição */}
      <h1 className="text-2xl font-semibold text-white">{product.name}</h1>
      <p className="mt-1 text-sm text-gray-400">{product.description}</p>

      {/* Preço */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-green-400 font-bold text-xl">
          {formatPrice(product.price)}
        </span>

        {product.oldPrice && (
          <span className="text-gray-500 line-through text-sm">
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>

      {/* Quantidade */}
      <div className="mt-6">
        <p className="text-sm text-gray-300 mb-2">Quantidade:</p>
        <div className="inline-flex items-center gap-4 rounded-full border border-gray-700 px-4 py-2">
          <button
            onClick={() =>
              setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
            }
            className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-lg text-gray-100"
          >
            –
          </button>
          <span className="w-4 text-center text-base text-gray-100">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="w-8 h-8 rounded-full border border-emerald-500 flex items-center justify-center text-lg text-emerald-400"
          >
            +
          </button>
        </div>
      </div>

      {/* Botões + aviso */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          className="rounded-full bg-emerald-500 px-6 py-3 text-center text-base font-semibold text-black shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:bg-emerald-400 transition"
        >
          Adicionar ao carrinho
        </button>

        {/* AVISO LOGO ABAIXO DO BOTÃO VERDE */}
        {added && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/40 px-4 py-2 text-[11px] font-medium text-emerald-200 shadow-[0_0_14px_rgba(34,197,94,0.35)]">
              <span className="text-sm">✅</span>
              <span>Produto adicionado ao carrinho</span>
            </div>
          </div>
        )}

        <button
          onClick={handleGoToCart}
          className="rounded-full border border-emerald-500 px-6 py-3 text-center text-base font-semibold text-emerald-400 hover:bg-emerald-500/10 transition"
        >
          Ir para o carrinho
        </button>
      </div>
    </main>
  );
}