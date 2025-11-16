// app/produto/[slug]/page.tsx
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductClient from "./product-client";

type Props = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}