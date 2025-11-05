// lib/products.ts
export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;           // em centavos
  image: string;           // caminho /public
  description: string;
  brand?: string;
  category: "acessorios" | "camisetas" | "moletons" | "outros";
  tags?: string[];
};

export const products: Product[] = [
  {
    id: "bone",
    slug: "bone",
    name: "Boné Aba Curva",
    price: 5990,
    image: "/bone.jpg",
    description: "Boné regulável, acabamento premium.",
    brand: "StreetOne",
    category: "acessorios",
    tags: ["promo", "unissex"]
  },
  {
    id: "moletom",
    slug: "moletom",
    name: "Moletom Classic",
    price: 15990,
    image: "/moletom.jpg",
    description: "Moletom felpado, quente e confortável.",
    brand: "UrbanFit",
    category: "moletons",
    tags: ["inverno"]
  },
  {
    id: "camiseta-preta",
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    price: 6990,
    image: "/camiseta-preta.jpg",
    description: "100% algodão, malha premium.",
    brand: "UrbanFit",
    category: "camisetas",
    tags: ["básico"]
  },
  {
    id: "camiseta-branca",
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    price: 6990,
    image: "/camiseta-branca.jpg",
    description: "Respirável, caimento perfeito.",
    brand: "UrbanFit",
    category: "camisetas",
    tags: ["básico"]
  },
];

export const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const findBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const CATEGORIES = [
  { key: "todas", label: "Todas" },
  { key: "camisetas", label: "Camisetas" },
  { key: "moletons",  label: "Moletons" },
  { key: "acessorios",label: "Acessórios" },
  { key: "outros",    label: "Outros" },
] as const;

export const BRANDS = Array.from(
  new Set(products.map(p => p.brand).filter(Boolean) as string[])
);
