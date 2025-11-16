// app/data/products.ts

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  priceFormatted: string;
  oldPrice?: number;
  oldPriceFormatted?: string;
  description: string;
  image: string; // caminho da imagem no /public
};

export const products: Product[] = [
  {
    id: 1,
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    price: 49.9,
    priceFormatted: "R$ 49,90",
    oldPrice: 59.9,
    oldPriceFormatted: "R$ 59,90",
    description:
      "Camiseta branca clássica, 100% algodão, perfeita para o dia a dia.",
    image: "/camiseta-branca.jpg", // <<-- NOME IGUAL AO DO SEU /public
  },
  {
    id: 2,
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    price: 59.9,
    priceFormatted: "R$ 59,90",
    description: "Camiseta preta básica, 100% algodão, estilo e conforto.",
    image: "/camiseta-preta.jpg",
  },
  {
    id: 3,
    slug: "moletom",
    name: "Moletom",
    price: 129.9,
    priceFormatted: "R$ 129,90",
    description: "Moletom quentinho e confortável para dias frios.",
    image: "/moletom.jpg",
  },
  {
    id: 4,
    slug: "bone",
    name: "Boné",
    price: 39.9,
    priceFormatted: "R$ 39,90",
    description: "Boné estiloso para completar o visual.",
    image: "/bone.jpg",
  },
];