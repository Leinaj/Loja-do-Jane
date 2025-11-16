// data/products.ts

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    description: "Camiseta leve e de alta qualidade.",
    price: 49.9,
    oldPrice: 59.9,
    image: "/products/camiseta-branca.png",
  },
  {
    id: 2,
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    description: "Camiseta preta básica, perfeita para o dia a dia.",
    price: 59.9,
    oldPrice: 69.9,
    image: "/products/camiseta-preta.png",
  },
  {
    id: 3,
    slug: "moletom-cinza",
    name: "Moletom Cinza",
    description: "Moletom confortável e estiloso.",
    price: 159.9,
    oldPrice: 189.9,
    image: "/products/moletom-cinza.png",
  },
  {
    id: 4,
    slug: "bone-preto",
    name: "Boné Preto",
    description: "Boné preto casual para o dia a dia.",
    price: 39.9,
    oldPrice: 49.9,
    image: "/products/bone-preto.png",
  },
];

// Helper opcional (se você quiser usar nos pages)
export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}