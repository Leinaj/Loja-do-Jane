export type Product = {
  id: string;
  slug: string;
  title: string;
  price: number; // em centavos
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "moletom-cinza",
    title: "Moletom Cinza",
    price: 15990,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&fit=crop",
    description: "Moletom confortável, modelagem unissex e tecido premium."
  },
  {
    id: "2",
    slug: "bone-street",
    title: "Boné Street",
    price: 5990,
    image: "https://images.unsplash.com/photo-1520975954732-35dd222996f2?q=80&w=1200&fit=crop",
    description: "Boné casual com aba curva e regulagem traseira."
  },
  {
    id: "3",
    slug: "camiseta-preta",
    title: "Camiseta Preta",
    price: 4990,
    image: "https://images.unsplash.com/photo-1520975928316-35dd222996f2?q=80&w=1200&fit=crop",
    description: "Camiseta 100% algodão, caimento perfeito e toque macio."
  },
  {
    id: "4",
    slug: "camiseta-branca",
    title: "Camiseta Branca",
    price: 4990,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=1200&fit=crop",
    description: "A básica que não erra. Ideal pra qualquer rolê."
  }
];

export const money = (cents: number) =>
  (cents/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });