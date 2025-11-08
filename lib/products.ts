// lib/products.ts
export type Product = {
  id: string
  slug: string
  name: string
  price: number
  oldPrice?: number
  image: string        // arquivo em /public
  badge?: string
  description: string  // <-- novo
}

export const products: Product[] = [
  {
    id: 'moletom-cinza',
    slug: 'moletom-cinza',
    name: 'Moletom Cinza',
    price: 159.9,
    oldPrice: 189.9,
    image: '/moletom.jpg',
    badge: 'Promoção ⚡',
    description:
      'Moletom cinza unissex, felpado por dentro e capuz ajustável. Conforto e estilo para o dia a dia.',
  },
  {
    id: 'bone-street',
    slug: 'bone-street',
    name: 'Boné Street',
    price: 79.9,
    image: '/bone.jpg',
    badge: 'Oferta 🔥',
    description:
      'Boné estilo street com ajuste traseiro e aba curva. Leve, resistente e versátil.',
  },
  {
    id: 'camiseta-preta',
    slug: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 59.9,
    oldPrice: 69.9,
    image: '/camiseta-preta.jpg',
    badge: 'Novo 🆕',
    description:
      'Camiseta preta 100% algodão, modelagem confortável e acabamento premium.',
  },
  {
    id: 'camiseta-branca',
    slug: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 54.9,
    image: '/camiseta-branca.jpg',
    badge: 'Básico 👍',
    description:
      'Clássica camiseta branca em algodão macio. Combina com tudo.',
  },
]