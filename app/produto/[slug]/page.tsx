// app/produto/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProductClient from "./product-client";
import { products, type Product } from "@/app/data/products";

type Props = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: Props) {
  const product: Product | undefined = products.find(
    (p) => p.slug === params.slug
  );

  if (!product) {
    return notFound();
  }

  return <ProductClient product={product} />;
}