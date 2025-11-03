'use client'

import { useMemo, useState } from 'react'

type Product = {
  id: string
  name: string
  price: number
  image: string
}

// 🔢 Seu WhatsApp e sua CHAVE PIX
const whatsappNumber = '5544988606483' // DDI 55 + DDD 44 + 988606483
const pixKey = '44988606483'           // sua chave Pix (telefone)

const products: Product[] = [
  { id: 'camiseta-preta',  name: 'Camiseta Preta',  price: 69.9,  image: '/images/camiseta-preta.jpg' },
  { id: 'camiseta-branca', name: 'Camiseta Branca', price: 69.9,  image: '/images/camiseta-branca.jpg' },
  { id: 'moletom',         name: 'Moletom',         price: 159.9, image: '/images/moletom.jpg' },
  { id: 'bone',            name: 'Boné',            price: 59.9,  image: '/images/bone.jpg' },
]

type CartItem = Product & { qty: number }

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [payment, setPayment] = useState<'pix' | 'cartao' | 'dinheiro' | ''>('')
  const [customer, setCustomer] = useState({ name: '', address: '' })

  const total = useMemo(
    () => cart.reduce((acc, it) => acc + it.price * it.qty, 0),
    [cart]
  )

  function addToCart(p: Product) {
    setCart(prev => {
      const i = prev.findIndex(x => x.id === p.id)
      if (i >= 0) {
        const clone = [...prev]
        clone[i] = { ...clone[i], qty: clone[i].qty + 1 }
        return clone
      }
      return [...prev, { ...p, qty: 1 }]
    })
  }

  function changeQty(id: string, delta: number) {
    setCart(prev => {
      const clone = prev.map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)
      return clone
    })
  }

  function removeItem(id: string) {
    setCart(prev => prev.filter(it => it.id !== id))
  }

  function formatBRL(n: number) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function finalizeWhatsApp() {
    if (!cart.length) return alert('Seu carrinho está vazio.')
    if (!payment)     return alert('Selecione a forma de pagamento.')

    const itens = cart
      .map(it => `• ${it.name} x${it.qty} — ${formatBRL(it.price * it.qty)}`)
      .join('%0A')

    const dadosCliente = [
      customer.name ? `Nome: ${customer.name}` : '',
      customer.address ? `Endereço: ${customer.address}` : '',
    ].filter(Boolean).join('%0A')

    const pagamento = payment === 'pix'
      ? `Pagamento: Pix%0AChave Pix: ${pixKey}`
      : payment === 'cartao'
      ? 'Pagamento: Cartão (link)'
      : 'Pagamento: Dinheiro/Retirada'

    const totalTxt = `Total: ${formatBRL(total)}`

    const msg =
      `Novo pedido 🍀%0A%0A${itens}%0A%0A${totalTxt}%0A${pagamento}` +
      (dadosCliente ? `%0A%0A${dadosCliente}` : '')

    const url = `https://wa.me/${whatsappNumber}?text=${msg}`
    window.open(url, '_blank')
  }

  function copyPix() {
    navigator.clipboard?.writeText(pixKey)
      .then(() => alert('Chave Pix copiada!'))
      .catch(() => alert('Não foi possível copiar, mas você pode selecionar e copiar manualmente.'))
  }

  return (
    <div style={{ background: '#0b0b0b', color: '#f5f5f5', minHeight: '100vh' }}>
      <header style={{ padding: 16, borderBottom: '1px solid #222' }}>
        <h1 style={{ fontSize: 24 }}>Loja da Jane</h1>
        <p style={{ opacity: 0.8 }}>Agora com catálogo, carrinho e Pix ✅</p>
      </header>

      <main style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr', padding: 16, maxWidth: 1000, margin: '0 auto' }}>
        {/* Catálogo */}
        <section>
          <h2 style={{ fontSize: 18, marginBottom:
