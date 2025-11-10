export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;        // caminho relativo ao /public
  compareAtPrice?: number;
  description: string;
  badge?: string;
};

export const products: Product[] = [
  {
    id: 'moletom-cinza',
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    price: 159.9,
    compareAtPrice: 189.9,
    image: '/moletom.jpg',                 // << aqui usa o arquivo do /public
    description: 'Moletom confortável e estiloso.',
    badge: 'Promo'
  },
  {
    id: 'camiseta-branca',
    slug: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 49.9,
    compareAtPrice: 59.9,
    image: '/camiseta-branca.jpg',
    description: 'Camiseta básica branca 100% algodão.'
  },
  {
    id: 'camiseta-preta',
    slug: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 49.9,
    compareAtPrice: 59.9,
    image: '/camiseta-preta.jpg',
    description: 'Camiseta básica preta 100% algodão.'
  },
  {
    id: 'bone',
    slug: 'bone',
    name: 'Boné',
    price: 79.9,
    compareAtPrice: 99.9,
    image: '/bone.jpg',
    description: 'Boné casual, ajuste confortável.'
  }
];