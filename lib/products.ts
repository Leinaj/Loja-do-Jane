export type Product = { id: string; name: string; price: number };

export const products: Product[] = [
  { id: "bone", name: "Boné", price: 59.9 },
  { id: "camiseta", name: "Camiseta", price: 79.9 }
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}