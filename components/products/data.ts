export type Product = {
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export const products: Product[] = [
  {
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    description: 'Moletom confortável e estiloso.',
    price: 159.9,
    image:
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'camiseta-preta',
    name: 'Camiseta Preta',
    description: 'Camiseta básica preta 100% algodão.',
    price: 49.9,
    image:
      'https://images.unsplash.com/photo-1520975922119-5a1615471d74?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'camiseta-branca',
    name: 'Camiseta Branca',
    description: 'Camiseta básica branca 100% algodão.',
    price: 49.9,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
  },
];