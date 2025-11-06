export type Product = {
  slug: string;
  title: string;
  price: number;
  image: string;
  description?: string;
};

export const products: Record<string, Product> = {
  moletom: {
    slug: "moletom",
    title: "Moletom",
    price: 159.9,
    image: "/products/moletom.jpg",
    description: "Moletom confortável para o dia a dia.",
  },
  bone: {
    slug: "bone",
    title: "Boné",
    price: 59.9,
    image: "/products/bone.jpg",
    description: "Boné estiloso, ajuste traseiro.",
  },
};

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}