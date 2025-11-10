// components/products/data.ts

export type Product = {
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  /** preço antigo (opcional) para aparecer riscado */
  oldPrice?: number;
};

export const products: Product[] = [
  {
    slug: "moletom-cinza",
    name: "Moletom Cinza",
    description: "Moletom confortável e estiloso.",
    price: 159.9,
    oldPrice: 189.9,
    image: "/moletom.jpg",
  },
  {
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    description: "Camiseta básica branca 100% algodão.",
    price: 49.9,
    oldPrice: 59.9,
    image: "/camiseta-branca.jpg",
  },
  {
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    description: "Camiseta básica preta 100% algodão.",
    price: 49.9,
    oldPrice: 59.9,
    image: "/camiseta-preta.jpg",
  },
  {
    slug: "bone",
    name: "Boné",
    description: "Boné clássico ajustável.",
    price: 39.9,
    // sem oldPrice, não mostra riscado
    image: "/bone.jpg",
  },
];

// helper (se você usa em alguma página)
export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}