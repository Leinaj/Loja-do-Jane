// lib/products.ts
export type Product = {
  slug: string;
  name: string;
  price: number; // em centavos
  image: string; // caminho em /public
  description: string;
};

export const products: Product[] = [
  {
    slug: "moletom",
    name: "Moletom Cinza",
    price: 15990,
    image: "/moletom.jpg",
    description: "Moletom felpado cinza, confortável para o dia a dia."
  },
  {
    slug: "bone",
    name: "Boné Street",
    price: 7990,
    image: "/bone.jpg",
    description: "Boné estilo street, aba curva e regulador traseiro."
  },
  {
    slug: "camiseta-preta",
    name: "Camiseta Preta",
    price: 4990,
    image: "/camiseta-preta.jpg",
    description: "Camiseta 100% algodão, malha penteada."
  },
  {
    slug: "camiseta-branca",
    name: "Camiseta Branca",
    price: 4990,
    image: "/camiseta-branca.jpg",
    description: "Clássica e versátil, 100% algodão."
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function priceBRL(valueInCents: number): string {
  return (valueInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}