// lib/products.ts
export type Product = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;       // caminho do /public
  description?: string;
  badge?: string;
};

export const products: Product[] = [
  {
    id: 1,
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    price: 159.9,
    oldPrice: 189.9,
    image: '/moletom.jpg',
    description: 'Moletom confortável em algodão, ideal para dias frios.',
    badge: 'Promoção ⚡',
  },
  {
    id: 2,
    slug: 'bone-street',
    name: 'Boné Street',
    price: 79.9,
    image: '/bone.jpg',
    description: 'Boné estiloso para completar o look.',
    badge: 'Oferta 🔥',
  },
  {
    id: 3,
    slug: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 49.9,
    image: '/camiseta-branca.jpg',
    description: 'Camiseta básica branca 100% algodão.',
  },
  {
    id: 4,
    slug: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 49.9,
    image: '/camiseta-preta.jpg',
    description: 'Camiseta básica preta 100% algodão.',
  },
];