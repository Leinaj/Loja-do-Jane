// components/products/data.ts
export type Product = {
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  description?: string;
};

export const products: Product[] = [
  {
    slug: "camiseta-branca",
    name: "Camiseta Branca Clássica",
    price: 49.9,
    oldPrice: 59.9,
    image: "/camiseta-branca.jpg",
    description: "Camiseta branca básica, confortável e versátil para o dia a dia."
  },
  {
    slug: "camiseta-preta",
    name: "Camiseta Preta Premium",
    price: 59.9,
    oldPrice: 79.9,
    image: "/camiseta-preta.jpg",
    description: "Camiseta preta premium com ótimo caimento e tecido macio."
  },
  {
    slug: "moletom",
    name: "Moletom Cinza",
    price: 159.9,
    oldPrice: 189.9,
    image: "/moletom.jpg",
    description: "Moletom quentinho, perfeito para dias frios e cheios de estilo."
  },
  {
    slug: "bone",
    name: "Boné Aba Reta",
    price: 39.9,
    oldPrice: 59.9,
    image: "/bone.jpg",
    description: "Boné estiloso com aba reta, ideal para completar o visual."
  }
];