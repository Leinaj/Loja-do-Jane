// app/data/products.ts

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  priceFormatted?: string;
  oldPrice?: number;
  oldPriceFormatted?: string;
  description?: string;
  image: string;
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
    description: "Camiseta branca clássica, 100% algodão, perfeita para o dia a dia.",
    image: "/products/camiseta1.png",
  },
];