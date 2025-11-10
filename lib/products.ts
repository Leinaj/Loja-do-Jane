export type Product = {
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
};

export const products: Product[] = [
  {
    slug: "moletom-cinza",
    name: "Moletom Cinza",
    description: "Moletom confortável e estiloso.",
    price: 159.9,
    oldPrice: 189.9,
    image: "/brands/moletom-cinza.jpg",
  },
  {
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    description: "Camiseta leve e de alta qualidade.",
    price: 49.9,
    oldPrice: 59.9,
    image: "/brands/camiseta-branca.jpg",
  },
  {
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    description: "Camiseta básica preta, ideal para o dia a dia.",
    price: 49.9,
    oldPrice: 59.9,
    image: "/brands/camiseta-preta.jpg",
  },
];