// components/products/data.ts

export type Product = {
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;       // nome do arquivo que está em /public
  description: string;
};

export const products: Product[] = [
  {
    slug: "moletom-cinza",
    name: "Moletom Cinza",
    price: 159.9,
    oldPrice: 189.9,
    image: "moletom.jpg", // 👈 exatamente como está na pasta /public
    description:
      "Moletom cinza confortável, ideal para dias frios e estilo casual.",
  },
  {
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    price: 49.9,
    oldPrice: 59.9,
    image: "camiseta-branca.jpg",
    description:
      "Camiseta branca clássica, combina com tudo e tem ótimo caimento.",
  },
  {
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    price: 49.9,
    oldPrice: 59.9,
    image: "camiseta-preta.jpg",
    description:
      "Camiseta preta básica, perfeita para um visual moderno e discreto.",
  },
  {
    slug: "bone",
    name: "Boné Estiloso",
    price: 39.9,
    oldPrice: 49.9,
    image: "bone.jpg",
    description:
      "Boné moderno para completar seu look com estilo e personalidade.",
  },
];