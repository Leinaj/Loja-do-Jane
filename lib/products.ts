// lib/products.ts

export type Product = {
  slug: string;
  title: string;
  price: number; // em reais
  image: string; // caminho dentro de /public
  description: string;
};

// Formata número para BRL (R$ 0.000,00)
export const money = (value: number): string =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Lista de produtos (ajustada para suas imagens em /public)
export const products: Product[] = [
  {
    slug: "moletom-cinza",
    title: "Moletom Cinza",
    price: 159.9,
    image: "/moletom.jpg",
    description: "Moletom unissex macio e quentinho, perfeito para o dia a dia."
  },
  {
    slug: "bone-street",
    title: "Boné Street",
    price: 59.9,
    image: "/bone.jpg",
    description: "Boné estiloso com ajuste traseiro e caimento confortável."
  },
  {
    slug: "camiseta-preta",
    title: "Camiseta Preta",
    price: 49.9,
    image: "/camiseta-preta.jpg",
    description: "Camiseta 100% algodão, corte moderno e super versátil."
  },
  {
    slug: "camiseta-branca",
    title: "Camiseta Branca",
    price: 49.9,
    image: "/camiseta-branca.jpg",
    description: "Clássica e confortável, ideal para compor qualquer look."
  }
];

// Helper para páginas dinâmicas
export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);