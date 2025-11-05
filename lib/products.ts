// lib/products.ts
export type Product = {
  id: string;
  title: string;
  price: number; // em R$
  image: string; // caminho em /public/images
};

export const products: Product[] = [
  { id: "moletom",          title: "Moletom",          price: 159.9, image: "/images/moletom.jpg" },
  { id: "bone",             title: "Boné",             price: 59.9,  image: "/images/bone.jpg" },
  { id: "camiseta-preta",   title: "Camiseta Preta",   price: 69.9,  image: "/images/camiseta-preta.jpg" },
  { id: "camiseta-branca",  title: "Camiseta Branca",  price: 69.9,  image: "/images/camiseta-branca.jpg" },
];