"use client";
import React, { useEffect, useMemo, useState } from "react";

// ================================
// LOJA DA JANE — Site profissional (catálogo + carrinho + checkout simulado)
// Single-file em app/page.tsx (Next.js App Router) com Tailwind.
// Inclui: Hero, Catálogo, Sobre, Contato, WhatsApp flutuante, LGPD básico.
// Pagamentos reais: troque o checkout simulado por Stripe/Mercado Pago.
// ================================

const formatBRL = (valueCents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(valueCents / 100);

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState] as const;
}
function cx(...a: Array<string | false | undefined>) { return a.filter(Boolean).join(" "); }

// Produtos (edite aqui)
type Product = { id: string; name: string; price: number; category: string; image?: string; tags?: string[]; stock?: number; };
const PRODUCTS: Product[] = [
  { id: "p1", name: "Camiseta Oversized Minimal", price: 7990, category: "Moda", image: "https://picsum.photos/seed/camiseta/1200/800", tags: ["unissex","algodão"], stock: 35 },
  { id: "p2", name: "Headphone Wireless Pro", price: 34990, category: "Eletrônicos", image: "https://picsum.photos/seed/headphone/1200/800", tags: ["bluetooth","noise-cancelling"], stock: 12 },
  { id: "p3", name: "Copo Térmico 600ml", price: 12990, category: "Casa & Cozinha", image: "https://picsum.photos/seed/copo/1200/800", tags: ["inox","térmico"], stock: 50 },
  { id: "p4", name: "Smartwatch Active X", price: 279900, category: "Eletrônicos", image: "https://picsum.photos/seed/watch/1200/800", tags: ["fitness","à prova d'água"], stock: 7 },
  { id: "p5", name: "Tênis Lifestyle Cloud", price: 25990, category: "Moda", image: "https://picsum.photos/seed/tenis/1200/800", tags: ["conforto","leve"], stock: 23 },
  { id: "p6", name: "Cafeteira Pour Over", price: 18990, category: "Casa & Cozinha", image: "https://picsum.photos/seed/cafe/1200/800", tags: ["barista","vidro"], stock: 14 },
];
const CATEGORIES = ["Todos", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

type CartItem = { product: Product; qty: number };

export default function LojaDaJane() {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("Todos");
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return PRODUCTS.filter(p => {
      const byCat = cat === "Todos" || p.category === cat;
      const byText = !qq || `${p.name} ${p.category} ${(p.tags||[]).join(" ")}`.toLowerCase().includes(qq);
      return byCat && byText;
    });
  }, [q, cat]);

  const [cart, setCart] = useLocalStorage<CartItem[]>("cart-v2", []);
  const total = useMemo(() => cart.reduce((s,i)=> s + i.product.price * i.qty, 0), [cart]);
  const [showCart, setShowCart] = useState(false);

  function addToCart(product: Product) {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: Math.min(copy[idx].qty + 1, product.stock ?? 999) };
        return copy;
      }
      return [...prev, { product, qty: 1 }];
    });
    setShowCart(true);
  }
  function changeQty(id: string, delta: number) {
    setCart(prev => prev.map(i => i.product.id===id ? { ...i, qty: Math.max(1, Math.min(i.qty + delta, i.product.stock ?? 999)) } : i));
  }
  function removeItem(id: string) { setCart(prev => prev.filter(i => i.product.id !== id)); }
  function clearCart(){ setCart([]); }

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [payment, setPayment] = useState<"pix"|"card"|"boleto">("pix");
  const [customer, setCustomer] = useState({ name:"", email:"", cep:"", address:"" });
  const [orderSuccess, setOrderSuccess] = useState<string|null>(null);
  const pixCode = useMemo(() => {
    const payload = {
      amount: (total/100).toFixed(2), name: customer.name || "CLIENTE",
      key: "chave-pix@seudominio.com.br", txid: "TX" + Math.random().toString(36).slice(2,10).toUpperCase(),
    };
    return `PIX|BR.GOV.BCB.PIX|KEY:${payload.key}|NAME:${payload.name}|AMOUNT:${payload.amount}|TXID:${payload.txid}`;
  }, [total, customer.name]);
  function submitOrder(e: React.FormEvent){
    e.preventDefault();
    if(!customer.name || !customer.email || !customer.cep || !customer.address){ alert("Preencha seus dados para continuar."); return; }
    if(cart.length===0){ alert("Seu carrinho está vazio."); return; }
    const orderId = "ORD-" + Math.random().toString(36).slice(2,8).toUpperCase();
    setOrderSuccess(orderId); clearCart();
  }

  // LGPD
  const [cookiesOk, setCookiesOk] = useLocalStorage<boolean>("lgpd-ok", false);
  function scrollToId(id: string){ document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={()=>scrollToId('home')}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
            <span className="font-bold text-lg">Loja da Jane</span>
          </div>
          <nav className="hidden md:flex items-center gap-3 text-sm">
            <button onClick={()=>scrollToId('catalogo')} className="px-3 py-1.5 rounded-lg hover:bg-neutral-100">Catálogo</button>
            <button onClick={()=>scrollToId('sobre')} className="px-3 py-1.5 rounded-lg hover:bg-neutral-100">Sobre</button>
            <button onClick={()=>scrollToId('contato')} className="px-3 py-1.5 rounded-lg hover:bg-neutral-100">Contato</button>
          </nav>
          <div className="flex items-center gap-2">
            <input placeholder="Buscar produtos..." value={q} onChange={(e)=>setQ(e.target.value)} className="hidden md:block w-80 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button onClick={()=>setShowCart(true)} className="relative rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-50" aria-label="Abrir carrinho">
              Carrinho
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-indigo-600 text-white text-[11px] min-w-5 h-5 px-1">{cart.reduce((s,i)=>s+i.qty,0)}</span>
            </button>
          </div>
        </div>
      </header>

      <section id="home" className="mx-auto max-w-7xl px-4 pt-10 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Site profissional, rápido e pronto pra vender.</h1>
          <p className="mt-3 text-neutral-600">Navegação simples, carrinho prático e checkout com Pix/Cartão (simulado). Troque os produtos e publique.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={()=>scrollToId('catalogo')} className="rounded-xl bg-neutral-900 text-white px-5 py-2.5 text-sm hover:bg-neutral-800">Ver catálogo</button>
            <a href="https://wa.me/55SEUNUMERO?text=Oi%20vim%20do%20site%20e%20quero%20ajuda%20com%20um%20pedido" target="_blank" className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm hover:bg-neutral-50">Fale no WhatsApp</a>
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-indigo-100 to-fuchsia-100 p-6 border border-indigo-200">
            <div className="text-sm text-neutral-700">
              <div className="font-semibold mb-2">Destaques</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Catálogo com busca e filtros</li>
                <li>Carrinho com persistência</li>
                <li>Checkout com Pix/Cartão/Boleto (simulado)</li>
                <li>LGPD e SEO-friendly</li>
              </ul>
            </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-2">
        <div className="flex flex-wrap gap-2 items-center">
          {CATEGORIES.map(c => (
            <button key={c} onClick={()=>setCat(c)} className={cx("rounded-full border px-4 py-1.5 text-sm", c===cat?"bg-neutral-900 text-white border-neutral-900":"bg-white border-neutral-300 hover:bg-neutral-100")}>{c}</button>
          ))}
          <div className="flex-1" />
          <div className="md:hidden w-full">
            <input placeholder="Buscar produtos..." value={q} onChange={(e)=>setQ(e.target.value)} className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </section>

      <main id="catalogo" className="mx-auto max-w-7xl px-4 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <article key={p.id} className="group rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
              {p.image ? (<img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />) : (<div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-100" />)}
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-semibold leading-tight">{p.name}</h3>
              <div className="text-sm text-neutral-500">{p.category}</div>
              <div className="mt-1 font-bold text-lg">{formatBRL(p.price)}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {(p.tags||[]).map(t => (<span key={t} className="text-[11px] rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-neutral-600">{t}</span>))}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={()=>addToCart(p)} className="flex-1 rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800">Adicionar ao carrinho</button>
                <button onClick={()=>{ addToCart(p); setCheckoutOpen(true); }} className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50">Comprar agora</button>
              </div>
            </div>
          </article>
        ))}
      </main>

      <section id="sobre" className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold">Sobre a Loja da Jane</h2>
            <p className="mt-2 text-neutral-600">Qualidade, preço justo e atendimento humano. Trocamos ou devolvemos sem drama. Você compra com segurança e recebe rápido.</p>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <li className="rounded-xl border p-3">🚚 Frete para todo Brasil</li>
              <li className="rounded-xl border p-3">🔒 Pagamento seguro</li>
              <li className="rounded-xl border p-3">💬 Suporte por WhatsApp</li>
              <li className="rounded-xl border p-3">↩️ Troca fácil</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-neutral-50 border p-6">
            <div className="font-semibold">FAQ</div>
            <details className="mt-3 border rounded-xl p-3">
              <summary className="font-medium cursor-pointer">Quanto tempo para entrega?</summary>
              <p className="text-sm text-neutral-600 mt-2">Depende do seu CEP. No checkout informamos estimativa. Integre um frete real (Melhor Envio) para cálculo automático.</p>
            </details>
            <details className="mt-3 border rounded-xl p-3">
              <summary className="font-medium cursor-pointer">Como funciona a troca?</summary>
              <p className="text-sm text-neutral-600 mt-2">Você tem 7 dias após o recebimento. Fale conosco no WhatsApp para combinar coleta/envio.</p>
            </details>
            <details className="mt-3 border rounded-xl p-3">
              <summary className="font-medium cursor-pointer">Quais formas de pagamento?</summary>
              <p className="text-sm text-neutral-600 mt-2">Pix, Cartão e Boleto (nesta demo são simulados; para produção, plugue Stripe/Mercado Pago).</p>
            </details>
          </div>
        </div>
      </section>

      <section id="contato" className="border-t bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold">Fale com a gente</h2>
            <p className="mt-2 text-neutral-600">Dúvidas, pedidos especiais ou parcerias? Estamos por aqui.</p>
            <div className="mt-4 text-sm">
              <div><span className="font-medium">Email:</span> contato@lojadjane.com.br</div>
              <div className="mt-1"><span className="font-medium">WhatsApp:</span> (XX) XXXXX-XXXX</div>
            </div>
            <div className="mt-4 flex gap-3">
              <a href="mailto:contato@lojadjane.com.br" className="rounded-xl border px-4 py-2 text-sm">Enviar email</a>
              <a href="https://wa.me/55SEUNUMERO?text=Oi%20vim%20do%20site" target="_blank" className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm">Chamar no WhatsApp</a>
            </div>
          </div>
          <div className="rounded-3xl bg-white border p-6">
            <div className="font-semibold">Políticas & LGPD</div>
            <p className="text-sm text-neutral-600 mt-2">Links fictícios. Substitua pelos seus textos oficiais.</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <PolicyModal title="Privacidade" body="Respeitamos sua privacidade. Coletamos apenas dados necessários para processar pedidos e melhorar sua experiência. Você pode solicitar remoção a qualquer momento." />
              <PolicyModal title="Termos de Uso" body="Ao usar este site, você concorda com nossos termos. Produtos podem ter variação de estoque e preço. Ofertas válidas enquanto durar o estoque." />
              <PolicyModal title="Trocas & Devoluções" body="Você tem 7 dias após o recebimento para desistir. Produto deve estar sem uso e com embalagem original." />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-neutral-600">
          <div>
            <div className="font-semibold text-neutral-900">Loja da Jane</div>
            <p className="mt-2">Seu marketplace moderno com Pix e cartão. Feito com ♥.</p>
          </div>
          <div>
            <div className="font-semibold text-neutral-900">Ajuda</div>
            <ul className="mt-2 space-y-1">
              <li>Trocas e Devoluções</li>
              <li>Privacidade (LGPD)</li>
              <li>Contato</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-neutral-900">Siga</div>
            <ul className="mt-2 space-y-1">
              <li>Instagram</li>
              <li>TikTok</li>
              <li>WhatsApp</li>
            </ul>
          </div>
        </div>
      </footer>

      {showCart && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setShowCart(false)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h2 className="font-semibold text-lg">Seu carrinho</h2>
              <button onClick={()=>setShowCart(false)} className="rounded-lg px-3 py-1.5 text-sm border hover:bg-neutral-50">Fechar</button>
            </div>
            <div className="flex-1 space-y-3 overflow-auto pr-1">
              {cart.length===0 ? (<p className="text-sm text-neutral-500">Nada por aqui ainda…</p>) : cart.map(item => (
                <div key={item.product.id} className="flex gap-3 border rounded-xl p-3">
                  <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden">
                    {item.product.image ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-100"/>}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm leading-tight">{item.product.name}</div>
                    <div className="text-xs text-neutral-500">{item.product.category}</div>
                    <div className="mt-1 font-semibold">{formatBRL(item.product.price)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={()=>changeQty(item.product.id,-1)} className="rounded border px-2">-</button>
                      <span className="text-sm w-6 text-center">{item.qty}</span>
                      <button onClick={()=>changeQty(item.product.id,1)} className="rounded border px-2">+</button>
                      <button onClick={()=>removeItem(item.product.id)} className="ml-auto text-xs text-red-600 hover:underline">Remover</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Subtotal</span>
                <span className="font-semibold">{formatBRL(total)}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">Frete e impostos calculados no checkout.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>setCheckoutOpen(true)} disabled={cart.length===0} className="flex-1 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm disabled:opacity-50 hover:bg-indigo-500">Finalizar compra</button>
                <button onClick={clearCart} className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50">Limpar</button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setCheckoutOpen(false)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-semibold">Checkout</h3>
              <button onClick={()=>setCheckoutOpen(false)} className="rounded-lg px-3 py-1.5 text-sm border hover:bg-neutral-50">Fechar</button>
            </div>
            {orderSuccess ? (
              <div className="p-6">
                <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                  <div className="font-semibold text-green-800">Pedido confirmado!</div>
                  <div className="text-sm text-green-700 mt-1">Código do pedido: {orderSuccess}</div>
                </div>
                <p className="text-sm text-neutral-600 mt-4">Isso é uma simulação. Para pagamentos reais, conecte Stripe/Mercado Pago e troque por um checkout oficial.</p>
              </div>
            ) : (
              <form onSubmit={submitOrder} className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
                <div className="md:col-span-3">
                  <h4 className="font-semibold mb-3">Seus dados</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input className="rounded-xl border border-neutral-300 px-3 py-2 text-sm" placeholder="Nome completo" value={customer.name} onChange={(e)=>setCustomer({...customer, name:e.target.value})} required />
                    <input className="rounded-xl border border-neutral-300 px-3 py-2 text-sm" placeholder="Email" type="email" value={customer.email} onChange={(e)=>setCustomer({...customer, email:e.target.value})} required />
                    <input className="rounded-xl border border-neutral-300 px-3 py-2 text-sm" placeholder="CEP" value={customer.cep} onChange={(e)=>setCustomer({...customer, cep:e.target.value})} required />
                    <input className="rounded-xl border border-neutral-300 px-3 py-2 text-sm" placeholder="Endereço completo" value={customer.address} onChange={(e)=>setCustomer({...customer, address:e.target.value})} required />
                  </div>
                  <h4 className="font-semibold mb-2 mt-6">Pagamento</h4>
                  <div className="flex gap-2 flex-wrap">
                    {[{id:"pix",label:"Pix"},{id:"card",label:"Cartão"},{id:"boleto",label:"Boleto"}].map(op=> (
                      <button key={op.id} type="button" onClick={()=>setPayment(op.id as any)} className={cx("rounded-xl border px-4 py-2 text-sm", payment===op.id?"bg-neutral-900 text-white border-neutral-900":"bg-white border-neutral-300 hover:bg-neutral-50")}>{op.label}</button>
                    ))}
                  </div>
                  {payment === "pix" && (
                    <div className="mt-4 rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
                      <div className="font-medium">Pix (simulado)</div>
                      <p className="text-sm text-neutral-600 mt-1">No real, gere QR Code e copia-e-cola via provedor de pagamento.</p>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                        <div className="aspect-square w-full rounded-xl bg-white border grid place-items-center text-xs text-neutral-500">QR CODE</div>
                        <div>
                          <label className="text-xs text-neutral-500">Copia e cola</label>
                          <textarea className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs" readOnly rows={4} value={pixCode} />
                          <button type="button" onClick={()=>navigator.clipboard.writeText(pixCode)} className="mt-2 rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">Copiar código</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {payment === "card" && (
                    <div className="mt-4 rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
                      <div className="font-medium">Cartão (simulado)</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        <input className="rounded-xl border border-neutral-300 px-3 py-2 text-sm" placeholder="Número do cartão" />
                        <input className="rounded-xl border border-neutral-300 px-3 py-2 text-sm" placeholder="Nome impresso" />
                        <input className="rounded-xl border border-neutral-300 px-3 py-2 text-sm" placeholder="Validade (MM/AA)" />
                        <input className="rounded-xl border border-neutral-300 px-3 py-2 text-sm" placeholder="CVC" />
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">Integre com Stripe/Mercado Pago para tokenizar e cobrar com segurança.</p>
                    </div>
                  )}
                  {payment === "boleto" && (
                    <div className="mt-4 rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
                      <div className="font-medium">Boleto (simulado)</div>
                      <p className="text-sm text-neutral-600 mt-1">No real, gere o PDF/linha digitável via provedor.</p>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-semibold mb-3">Resumo</h4>
                  <div className="space-y-3 max-h-72 overflow-auto pr-2">
                    {cart.length===0 ? (<p className="text-sm text-neutral-500">Seu carrinho está vazio.</p>) : cart.map(i => (
                      <div key={i.product.id} className="flex items-center gap-3 border rounded-xl p-3">
                        <div className="w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden">
                          {i.product.image ? <img src={i.product.image} alt={i.product.name} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-100"/>}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium leading-tight">{i.product.name}</div>
                          <div className="text-xs text-neutral-500">x{i.qty}</div>
                        </div>
                        <div className="font-semibold text-sm">{formatBRL(i.product.price * i.qty)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t pt-3 space-y-1 text-sm">
                    <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-semibold">{formatBRL(total)}</span></div>
                    <div className="flex items-center justify-between text-neutral-500"><span>Frete</span><span>Calculado após CEP</span></div>
                    <div className="flex items-center justify-between font-semibold text-base"><span>Total</span><span>{formatBRL(total)}</span></div>
                    <button type="submit" className="mt-3 w-full rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm disabled:opacity-50 hover:bg-emerald-500" disabled={cart.length===0}>Confirmar pedido</button>
                    <p className="text-[11px] text-neutral-500 mt-2">Ao continuar você concorda com os Termos da Loja e a Política de Privacidade.</p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <a href="https://wa.me/55SEUNUMERO?text=Oi%20vim%20do%20site" target="_blank" className="fixed bottom-4 right-4 rounded-full shadow-lg bg-emerald-600 text-white px-4 py-3 text-sm">WhatsApp</a>

      {!cookiesOk && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 text-white text-sm">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
            <span>Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa Política de Privacidade.</span>
            <button onClick={()=>setCookiesOk(true)} className="ml-auto rounded-lg bg-white text-neutral-900 px-3 py-1.5">Aceitar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PolicyModal({ title, body }: { title: string; body: string; }){
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={()=>setOpen(true)} className="rounded-xl border px-3 py-1.5">{title}</button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setOpen(false)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-semibold">{title}</h3>
              <button onClick={()=>setOpen(false)} className="rounded-lg px-3 py-1.5 text-sm border hover:bg-neutral-50">Fechar</button>
            </div>
            <div className="p-6 text-sm text-neutral-700 whitespace-pre-wrap">{body}</div>
          </div>
        </div>
      )}
    </>
  );
}
