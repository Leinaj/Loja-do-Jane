// lib/products.ts
export type Product = {
  id: string;
  name: string;
  price: number; // em centavos
  image: string; // caminho em /public/images
  brand?: string;
  description?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "camiseta-preta",
    name: "Camiseta Preta",
    price: 6990,
    image: "/images/camiseta-preta.jpg",
    brand: "generic",
    description: "Camiseta 100% algodão, corte unissex, confortável e leve."
  },
  {
    id: "camiseta-branca",
    name: "Camiseta Branca",
    price: 6990,
    image: "/images/camiseta-branca.jpg",
    brand: "generic",
    description: "Clássica, combina com tudo. Malha premium."
  },
  {
    id: "moletom",
    name: "Moletom",
    price: 15990,
    image: "/images/moletom.jpg",
    brand: "generic",
    description: "Moletom com capuz, interior flanelado, super macio."
  },
  {
    id: "bone",
    name: "Boné",
    price: 5990,
    image: "/images/bone.jpg",
    brand: "generic",
    description: "Boné aba curva, regulável, acabamento de qualidade."
  }
];

// Marcas mostradas na faixa de logos
export const BRANDS = [
  { name: "Nokia",   logo: "/brands/nokia.png" },
  { name: "Canon",   logo: "/brands/canon.png" },
  { name: "Samsung", logo: "/brands/samsung.png" },
  { name: "Apple",   logo: "/brands/apple.png" },
];

export const money = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const findProduct = (id: string) => PRODUCTS.find(p => p.id === id);
