export type Product = {
  slug: string;
  title: string;
  price: number;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    slug: "moletom-cinza",
    title: "Moletom Cinza",
    price: 159.90,
    image: "/moletom.jpg",
    description: "Moletom unissex macio e quentinho, perfeito para o dia a dia."
  },
  {
    slug: "bone-street",
    title: "Boné Street",
    price: 59.90,
    image: "/bone.jpg",
    description: "Boné estiloso com ajuste traseiro e caimento confortável."
  },
  {
    slug: "camiseta-preta",
    title: "Camiseta Preta",
    price: 49.90,
    image: "/camiseta-preta.jpg",
    description: "Camiseta 100% algodão, corte moderno e super versátil."
  },
  {
    slug: "camiseta-branca",
    title: "Camiseta Branca",
    price: 49.90,
    image: "/camiseta-branca.jpg",
    description: "Clássica e confortável, ideal para compor qualquer look."
  }
];