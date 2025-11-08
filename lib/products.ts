// lib/products.ts
export type Product = {
  id: string
  slug: string
  name: string
  price: number
  oldPrice?: number
  image: string        // caminho relativo em /public
  badge?: string
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
  },
  {
    id: 'bone-street',
    slug: 'bone-street',
    name: 'Boné Street',
    price: 79.9,
    image: '/bone.jpg',
    badge: 'Oferta 🔥',
  },
  {
    id: 'camiseta-preta',
    slug: 'camiseta-preta',
    name: 'Camiseta Preta',
    price: 59.9,
    oldPrice: 69.9,
    image: '/camiseta-preta.jpg',
    badge: 'Novo 🆕',
  },
  {
    id: 'camiseta-branca',
    slug: 'camiseta-branca',
    name: 'Camiseta Branca',
    price: 54.9,
    image: '/camiseta-branca.jpg',
    badge: 'Básico 👍',
  },
]