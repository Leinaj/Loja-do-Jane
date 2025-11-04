// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://loja-do-jane.vercel.app";
  return [
    { url: `${base}/`,              lastModified: new Date(), priority: 1 },
    { url: `${base}/trocas`,        lastModified: new Date(), priority: 0.5 },
    { url: `${base}/politica-privacidade`, lastModified: new Date(), priority: 0.5 },
  ];
}
