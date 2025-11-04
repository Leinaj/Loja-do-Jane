'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

/** CONFIG SIMPLES */
const WHATSAPP = '5544988606483'        // +55 44 98860-6483 (sem sinal)
const PIX_KEY  = '44988606483'

/** PRODUTOS (mantenha os caminhos das imagens que você já usou) */
const PRODUCTS = [
  { id: 'camiseta-preta',  name: 'Camiseta Preta',  price: 69.9,  img: '/images/camiseta-preta.jpg' },
  { id: 'camiseta-branca', name: 'Camiseta Branca', price: 69.9,  img: '/images/camiseta-branca.jpg' },
  { id: 'moletom',         name: 'Moletom',         price: 159.9, img: '/images/moletom.jpg' },
  { id: 'bone',            name: 'Boné',            price: 59.9,  img: '/images/bone.jpg' },
]

/** MARCAS — coloque os arquivos em /public/brands com estes nomes */
const BRANDS = [
  { name: 'Nokia',   src: '/brands/nokia.png' },
  { name: 'Canon',   src: '/brands/canon.png' },
  { name: 'Samsung', src: '/brands/samsung.png' },
  { name: 'Apple',   src: '/brands/apple.png' },
]

type Cart = Record<string, number>

export default function Page() {
  const [cart, setCart] = useState<Cart>({})

  const add = (id: string) =>
    setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))

  const remove = (id: string) =>
    setCart(prev => {
      const q = (prev[id] ?? 0) - 1
      if (q <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: q }
    })

  const cartItems = useMemo(() => Object.entries(cart)
    .map(([id, qty]) => {
      const p = PRODUCTS.find(x => x.id === id)!
      return { ...p, qty, subtotal: p.price * qty }
    }), [cart])

  const total = cartItems.reduce((s, i) => s + i.subtotal, 0)

  const waText = encodeURIComponent(
    `Olá! Quero finalizar meu pedido:\n\n${
      cartItems.map(i => `• ${i.qty}x ${i.name} — R$ ${i.subtotal.toFixed(2).replace('.', ',')}`).join('\n')
    }\n\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\nChave PIX: ${PIX_KEY}`
  )
  const waLink = `https://wa.me/${WHATSAPP}?text=${waText}`

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-200">
      {/* BARRA SUPERIOR */}
      <div className="w-full bg-zinc-900/80 text-xs sm:text-sm border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-2 flex flex-wrap gap-x-6 gap-y-1 justify-between">
          <div>Bem-vinda à <b>Loja da Jane</b> ✨</div>
          <div className="opacity-80">Suporte: WhatsApp <b>+55 {WHATSAPP.replace('55','').replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3')}</b></div>
          <div className="opacity-80">Carrinho: <b>{cartItems.length} itens</b> — R$ {total.toFixed(2).replace('.', ',')}</div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8 space-y-10">
        {/* NAV */}
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight">
            <span className="text-zinc-300">Loja da </span>
            <span className="bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">Jane</span>
          </div>
          <ul className="hidden sm:flex gap-6 text-zinc-300">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Catálogo</li>
            <li className="hover:text-white cursor-pointer">Contato</li>
          </ul>
        </nav>

        {/* HERO */}
        <section className="grid md:grid-cols-[1.4fr,1fr] gap-6 items-stretch">
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="relative">
              <Image
                src="/banner.jpg" alt="Banner"
                width={1200} height={500} priority
                className="w-full h-56 sm:h-72 md:h-[320px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/40 to-transparent" />
            </div>
            <div className="p-5 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-semibold">
                iPhone 6 <span className="text-emerald-400">Plus</span>
              </h1>
              <p className="mt-2 text-zinc-400">
                Exemplo de banner. Para trocar, substitua o arquivo <code className="bg-zinc-800 px-2 py-0.5 rounded">/public/banner.jpg</code>.
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <a href="#catalogo" className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-white">Ver produtos</a>
                <a href={waLink} target="_blank" className="rounded-lg border border-zinc-700 hover:border-zinc-500 px-4 py-2">Finalizar no WhatsApp</a>
              </div>
            </div>
          </div>

          {/* BENEFÍCIOS */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { t: '30 dias para troca', s: 'Sem estresse',        bg: 'bg-sky-950/50',    border: 'border-sky-900/60' },
              { t: 'Frete grátis*',     s: 'Consulte condições',   bg: 'bg-amber-950/40',  border: 'border-amber-900/60' },
              { t: 'Pagamentos seguros',s: 'Pix, Cartão',          bg: 'bg-rose-950/40',   border: 'border-rose-900/60' },
              { t: 'Novidades semanais',s: 'Sempre tem coisa nova',bg: 'bg-emerald-950/40',border: 'border-emerald-900/60' },
            ].map((b,i)=>(
              <div key={i} className={`rounded-2xl ${b.bg} border ${b.border} px-5 py-4`}>
                <div className="text-lg font-medium">{b.t}</div>
                <div className="text-zinc-400 text-sm">{b.s}</div>
              </div>
            ))}
          </div>
        </section>

        {/* MARCAS */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center">
            {BRANDS.map(b => (
              <div key={b.name} className="opacity-80 hover:opacity-100 transition">
                <Image src={b.src} alt={b.name} width={120} height={60} className="object-contain" />
              </div>
            ))}
          </div>
        </section>

        {/* CATÁLOGO */}
        <section id="catalogo" className="space-y-4">
          <h2 className="text-xl font-semibold">Últimos Produtos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {PRODUCTS.map(p => (
              <article key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                {/* IMAGEM com altura fixa (todas iguais) */}
                <div className="relative aspect-[4/5] w-full">
                  <Image src={p.img} alt={p.name} fill className="object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-medium">{p.name}</h3>
                  <div className="text-lg font-semibold">R$ {p.price.toFixed(2).replace('.', ',')}</div>
                  <button onClick={() => add(p.id)} className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 text-white">
                    Adicionar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CARRINHO */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Carrinho</h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            {cartItems.length === 0 ? (
              <div className="text-zinc-400">Seu carrinho está vazio.</div>
            ) : (
              <div className="space-y-3">
                {cartItems.map(i => (
                  <div key={i.id} className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div>{i.name}</div>
                      <div className="text-sm text-zinc-400">{i.qty}x — R$ {i.subtotal.toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => remove(i.id)} className="px-2 py-1 rounded border border-zinc-700">-</button>
                      <button onClick={() => add(i.id)}    className="px-2 py-1 rounded bg-emerald-600 text-white">+</button>
                    </div>
                  </div>
                ))}
                <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                  <b>Total</b>
                  <b>R$ {total.toFixed(2).replace('.', ',')}</b>
                </div>
                <a href={waLink} target="_blank" className="inline-flex justify-center w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 text-white">
                  Finalizar no WhatsApp
                </a>
              </div>
            )}
          </div>
        </section>

        {/* PAGAMENTO & CONTATO */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Pagamento & Contato</h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div>
              <div className="text-zinc-400">WhatsApp</div>
              <a className="text-emerald-400 hover:underline" href={`https://wa.me/${WHATSAPP}`} target="_blank">
                +55 (44) 98860-6483
              </a>
            </div>
            <div>
              <div className="text-zinc-400">Chave PIX</div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 rounded-lg bg-zinc-800 font-mono">{PIX_KEY}</div>
                <button
                  onClick={() => navigator.clipboard.writeText(PIX_KEY)}
                  className="rounded-lg border border-zinc-700 hover:border-zinc-500 px-3 py-2"
                >
                  Copiar chave
                </button>
              </div>
            </div>
            <p className="text-zinc-400">Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.</p>
          </div>
        </section>

        <footer className="py-10 text-center text-zinc-500">
          © {new Date().getFullYear()} Loja da Jane — feito com amor 💚
        </footer>
      </main>
    </div>
  )
}
