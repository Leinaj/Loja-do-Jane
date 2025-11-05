// lib/products.ts
export type Product = {
  slug: string;
  title: string;
  price: number; // em centavos
  image: string; // caminho dentro de /public
  description: string;
};

export const products: Record<string, Product> = {
  moletom: {
    slug: "moletom",
    title: "Moletom",
    price: 15990,
    image: "/images/moletom.jpg",
    description: "Moletom confortável, algodão premium, interior felpado.",
  },
  bone: {
    slug: "bone",
    title: "Boné",
    price: 5990,
    image: "/images/bone.jpg",
    description: "Boné ajustável, acabamento top, casual e estiloso.",
  },
  "camiseta-branca": {
    slug: "camiseta-branca",
    title: "Camiseta Branca",
    price: 6990,
    image: "/images/camiseta-branca.jpg",
    description: "Camiseta 100% algodão, corte clássico, veste bem.",
  },
  "camiseta-preta": {
    slug: "camiseta-preta",
    title: "Camiseta Preta",
    price: 6990,
    image: "/images/camiseta-preta.jpg",
    description: "Preta básica que combina com tudo.",
  },
};

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}