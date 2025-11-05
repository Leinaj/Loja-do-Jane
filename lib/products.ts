// lib/products.ts
export type Product = {
  id: string;
  title: string;
  price: number;
  image: string; // caminho em /public/products
};

export const products: Product[] = [
  { id: "moletom", title: "Moletom", price: 159.9, image: "/products/moletom.jpg" },
  { id: "bone", title: "Boné", price: 59.9, image: "/products/bone.jpg" },
];