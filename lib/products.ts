
// lib/products.ts
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "camiseta-preta",
    name: "Camiseta Preta",
    price: 69.9,
    image: "/images/camiseta-preta.jpg",
    description: "Camiseta 100% algodão, caimento clássico."
  },
  {
    id: "camiseta-branca",
    name: "Camiseta Branca",
    price: 69.9,
    image: "/images/camiseta-branca.jpg",
    description: "Básica, confortável e versátil."
  },
  {
    id: "moletom",
    name: "Moletom",
    price: 159.9,
    image: "/images/moletom.jpg",
    description: "Moletom com capuz, super macio."
  },
  {
    id: "bone",
    name: "Boné",
    price: 59.9,
    image: "/images/bone.jpg",
    description: "Boné ajustável, estilo casual."
  },
];

export const BRANDS = ["nokia", "canon", "samsung", "apple"];

export const money = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const findProduct = (id: string) =>
  PRODUCTS.find((p) => p.id === id);
