// lib/products.ts
export type Product = {
  slug: string;
  title: string;
  price: number;
  image: string;        // caminho relativo a /public
  description?: string;
};

export const products: Record<string, Product> = {
  moletom: {
    slug: "moletom",
    title: "Moletom",
    price: 159.9,
    image: "/images/moletom.jpg",
    description: "Moletom confortável, tecido premium.",
  },
  bone: {
    slug: "bone",
    title: "Boné",
    price: 59.9,
    image: "/images/bone.jpg",
    description: "Boné estiloso com ajuste traseiro.",
  },
  "camiseta-preta": {
    slug: "camiseta-preta",
    title: "Camiseta Preta",
    price: 49.9,
    image: "/images/camiseta-preta.jpg",
    description: "Malha 100% algodão, corte clássico.",
  },
  "camiseta-branca": {
    slug: "camiseta-branca",
    title: "Camiseta Branca",
    price: 49.9,
    image: "/images/camiseta-branca.jpg",
    description: "Leve, respirável e versátil.",
  },
};

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}