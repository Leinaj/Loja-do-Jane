// app/sitemap.ts
import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loja-do-jane.vercel.app";
  const statics = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contato`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  ];
  const productsPages = Object.values(products).map((p) => ({
    url: `${base}/produto/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [...statics, ...productsPages];
}
