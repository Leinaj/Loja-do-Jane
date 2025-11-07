export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // em centavos ou reais? aqui em reais (numero normal)
  image: string;
  description?: string;
};

export const products: Product[] = [
  {
    id: "bone",
    slug: "bone-street",
    name: "Boné Street",
    price: 79.9,
    image: "/bone.jpg",
    description: "Boné estiloso para o dia a dia.",
  },
  {
    id: "moletom",
    slug: "moletom-cinza",
    name: "Moletom Cinza",
    price: 159.9,
    image: "/moletom.jpg",
    description: "Quentinho e confortável.",
  },
  {
    id: "camiseta-branca",
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    price: 49.9,
    image: "/camiseta-branca.jpg",
    description: "Básica e versátil.",
  },
  {
    id: "camiseta-preta",
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    price: 49.9,
    image: "/camiseta-preta.jpg",
    description: "Básica e estilosa.",
  },
];

export function priceBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function productBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}