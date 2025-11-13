export type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  description?: string;
};

export const products: Product[] = [
  {
    slug: "camiseta-preta",
    name: "Camiseta Preta Premium",
    price: 59.9,
    image: "/camiseta-preta.jpg",
    description: "Camiseta preta de alta qualidade, perfeita para o dia a dia."
  },
  {
    slug: "camiseta-branca",
    name: "Camiseta Branca Clássica",
    price: 49.9,
    image: "/camiseta-branca.jpg",
    description: "Estilo clean e confortável para qualquer ocasião."
  },
  {
    slug: "moletom",
    name: "Moletom Unissex",
    price: 129.9,
    image: "/moletom.jpg",
    description: "Moletom macio, quente e estiloso."
  },
  {
    slug: "bone",
    name: "Boné Aba Reta",
    price: 39.9,
    image: "/bone.jpg",
    description: "Boné ajustável com visual moderno."
  }
];