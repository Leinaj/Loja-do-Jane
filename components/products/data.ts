// components/products/data.ts

export type Product = {
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    price: 49.9,
    oldPrice: 59.9,
    image: "/camiseta-branca.jpg", // está em /public
    description:
      "Camiseta branca clássica, 100% algodão, perfeita para o dia a dia."
  },
  {
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    price: 49.9,
    oldPrice: 59.9,
    image: "/camiseta-preta.jpg",
    description:
      "Camiseta preta básica com caimento confortável, combina com tudo."
  },
  {
    slug: "bone-street",
    name: "Boné Street",
    price: 39.9,
    oldPrice: 49.9,
    image: "/bone.jpg",
    description:
      "Boné estiloso para completar o visual street, ajustável e confortável."
  },
  {
    slug: "moletom-cinza",
    name: "Moletom Cinza",
    price: 159.9,
    oldPrice: 189.9,
    image: "/moletom.jpg",
    description:
      "Moletom cinza macio por dentro, ideal para os dias mais frios."
  }
];