// app/data/products.ts
export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

const products: Product[] = [
  {
    id: 'moletom-cinza',
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    description: 'Moletom confortável e estiloso.',
    price: 159.9,
    image: '/images/moletom-cinza.jpg',
  },
  {
    id: 'bonie-street',
    slug: 'bonie-street',
    name: 'Boné Street',
    description: 'Boné casual moderno.',
    price: 79.9,
    image: '/images/bonie-street.jpg',
  },
  {
    id: 'camiseta-preta',
    slug: 'camiseta-preta',
    name: 'Camiseta Preta',
    description: 'Camiseta básica preta 100% algodão.',
    price: 49.9,
    image: '/images/camiseta-preta.jpg',
  },
  {
    id: 'camiseta-branca',
    slug: 'camiseta-branca',
    name: 'Camiseta Branca',
    description: 'Camiseta básica branca 100% algodão.',
    price: 49.9,
    image: '/images/camiseta-branca.jpg',
  },
];

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}