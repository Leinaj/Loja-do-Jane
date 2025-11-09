// src/data/products.ts
export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  oldPrice?: number;
};

// 👉 Substitua pelos seus produtos reais:
export const products: Product[] = [
  {
    id: 'moleton-cinza',
    slug: 'moleton-cinza',
    name: 'Moletom Cinza',
    price: 159.9,
    oldPrice: 189.9,
    image: '/img/moleton-cinza.jpg',
    description: 'Moletom confortável e quentinho.'
  },
  {
    id: 'bonnie-street',
    slug: 'bonnie-street',
    name: 'Bonnie Street',
    price: 79.9,
    image: '/img/bonnie-street.jpg',
    description: 'Boné casual para o dia a dia.'
  },
  {
    id: 'camiseta-preta',
    slug: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 49.9,
    image: '/img/camiseta-preta.jpg',
    description: 'Camiseta básica preta 100% algodão.'
  },
  {
    id: 'camiseta-branca',
    slug: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 49.9,
    image: '/img/camiseta-branca.jpg',
    description: 'Camiseta básica branca 100% algodão.'
  }
];

export function getProduct(slug: string): Product | null {
  return products.find(p => p.slug === slug) ?? null;
}