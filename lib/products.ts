// lib/products.ts
export type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  image: string;      // URL da imagem
  badge?: string;     // texto do selo (ex.: "Promoção ⚡")
};

export const products: Product[] = [
  {
    id: 'hoodie-gray',
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    description: 'Moletom confortável, interior flanelado.',
    price: 159.9,
    oldPrice: 189.9,
    image:
      'https://images.unsplash.com/photo-1542060749-10c28b62716f?q=80&w=1200&auto=format&fit=crop',
    badge: 'Promoção ⚡',
  },
  {
    id: 'cap-street',
    slug: 'bone-street',
    name: 'Boné Street',
    description: 'Boné aba curva, ajuste traseiro.',
    price: 79.9,
    image:
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
    badge: 'Oferta 🔥',
  },
];