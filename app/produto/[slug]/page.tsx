// app/produto/[slug]/page.tsx
import { notFound } from "next/navigation";
import { products } from "@/components/products/data";
import ProductClient from "./product-client";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return notFound();
  }

  return <ProductClient product={product} />;
}