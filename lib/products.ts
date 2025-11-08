// lib/products.ts
export type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  image: string;   // caminho relativo em /public
  badge?: string;
};

export const products: Product[] = [
  {
    id: 'hoodie-gray',
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    description: 'Moletom confortável, interior flanelado.',
    price: 159.9,
    oldPrice: 189.9,
    image: '/moletom.jpg',   // <- /public/moletom.jpg
    badge: 'Promoção ⚡',
  },
  {
    id: 'cap-street',
    slug: 'bone-street',
    name: 'Boné Street',
    description: 'Boné aba curva, ajuste traseiro.',
    price: 79.9,
    image: '/bone.jpg',      // <- /public/bone.jpg
    badge: 'Oferta 🔥',
  },
];