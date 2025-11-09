export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // em reais (centavos opcionais)
  image: string;
};

const products: Product[] = [
  {
    id: 'hoodie-gray',
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    description: 'Moletom confortável cor cinza, macio por dentro.',
    price: 159.9,
    image: '/images/moletom-cinza.jpg',
  },
  {
    id: 'cap-street',
    slug: 'bonie-street',
    name: 'Boné Street',
    description: 'Boné casual para o dia a dia.',
    price: 79.9,
    image: '/images/bone-street.jpg',
  },
  {
    id: 'tee-black',
    slug: 'camiseta-preta',
    name: 'Camiseta Preta',
    description: 'Camiseta básica preta 100% algodão.',
    price: 49.9,
    image: '/images/camiseta-preta.jpg',
  },
  {
    id: 'tee-white',
    slug: 'camiseta-branca',
    name: 'Camiseta Branca',
    description: 'Camiseta básica branca 100% algodão.',
    price: 49.9,
    image: '/images/camiseta-branca.jpg',
  },
];

export async function getProducts(): Promise<Product[]> {
  // poderia vir de um fetch/DB — deixei sync por simplicidade
  return products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}