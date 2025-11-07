// lib/products.ts
export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // em centavos? -> aqui em reais (número normal)
  image: string; // caminho dentro de /public
  description: string;
};

export const priceBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const products: Product[] = [
  {
    id: "1",
    slug: "moletom-cinza",
    name: "Moletom Cinza",
    price: 159.9,
    image: "/moletom.jpg",
    description:
      "Moletom confortável e quentinho para os dias frios. Tecido premium."
  },
  {
    id: "2",
    slug: "bone-street",
    name: "Boné Street",
    price: 79.9,
    image: "/bone.jpg",
    description:
      "Boné estilo streetwear com ajuste traseiro. Leve e durável."
  },
  {
    id: "3",
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    price: 49.9,
    image: "/camiseta-preta.jpg",
    description:
      "Camiseta 100% algodão, corte clássico e super confortável."
  },
  {
    id: "4",
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    price: 49.9,
    image: "/camiseta-branca.jpg",
    description:
      "Camiseta branca essencial, perfeita para o dia a dia."
  }
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);