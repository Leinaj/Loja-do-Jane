// lib/products.ts

export type Product = {
  slug: string;
  title: string;
  price: number; // em centavos? -> aqui é em reais (número normal)
  image: string; // caminho dentro de /public
  description: string;
};

export const products: Product[] = [
  {
    slug: "moletom-cinza",
    title: "Moletom Cinza",
    price: 159.9,
    image: "/moletom.jpg",
    description: "Moletom confortável para o dia a dia.",
  },
  {
    slug: "bone-street",
    title: "Boné Street",
    price: 59.9,
    image: "/bone.jpg",
    description: "Boné casual com ajuste traseiro.",
  },
  {
    slug: "camiseta-preta",
    title: "Camiseta Preta",
    price: 49.9,
    image: "/camiseta-preta.jpg",
    description: "Camiseta 100% algodão, corte clássico.",
  },
  {
    slug: "camiseta-branca",
    title: "Camiseta Branca",
    price: 49.9,
    image: "/camiseta-branca.jpg",
    description: "Camiseta 100% algodão, super macia.",
  },
];

// Formata número em BRL (R$ 0,00)
export const priceBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Busca de produto por slug
export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);