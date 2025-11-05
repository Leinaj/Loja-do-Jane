// app/sitemap.ts
import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loja-do-jane.vercel.app";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now },
    ...PRODUCTS.map(p => ({ url: `${base}/p/${p.id}`, lastModified: now })),
    { url: `${base}/conta`, lastModified: now },
  ];
}
