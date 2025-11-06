// lib/products.ts
export type Product = {
  slug: string;
  title: string;
  price: number; // centavos
  image: string;
};

export const products: Product[] = [
  { slug: "moletom", title: "Moletom", price: 15990, image: "/images/moletom.jpg" },
  { slug: "bone", title: "Boné", price: 5990, image: "/images/bone.jpg" },
  { slug: "camiseta-branca", title: "Camiseta Branca", price: 6990, image: "/images/camiseta-branca.jpg" },
  { slug: "camiseta-preta", title: "Camiseta Preta", price: 6990, image: "/images/camiseta-preta.jpg" },
];

export function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}