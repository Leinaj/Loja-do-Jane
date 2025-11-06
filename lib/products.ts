export type Product = {
  id: string;
  name: string;
  price: number; // em centavos
  image: string; // caminho em /public/images
};

export const PRODUCTS: Product[] = [
  { id: "moletom",        name: "Moletom",         price: 15990, image: "/images/moletom.jpg" },
  { id: "bone",           name: "Boné",            price:  5990, image: "/images/bone.jpg" },
  { id: "camiseta-preta", name: "Camiseta Preta",  price:  6990, image: "/images/camiseta-preta.jpg" },
  { id: "camiseta-branca",name: "Camiseta Branca", price:  6990, image: "/images/camiseta-branca.jpg" }
];