"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import MiniCart from "@/components/MiniCart";
import Filters from "@/components/Filters";
import { products as ALL, formatBRL, type Product } from "@/lib/products";

type Cart = Record<string, number>;

const WHATS_E164 = "5544988606483";   // +55 44 98860-6483
const PIX = "44988606483";            // sua chave PIX

export default function Page() {
  // ---------- estado base ----------
  const [cart, setCart] = useState<Cart>({});
  const [miniOpen, setMiniOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // filtros
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("todas");
  const [brand, setBrand] = useState("todas");
  const [maxPrice, setMaxPrice] = useState(400); // em R$

  // ---------- catálogo filtrado ----------
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ALL.filter(p => {
      const okQ = !needle || p.name.toLowerCase().includes(needle);
      const okCat = category === "todas" || p.category === category;
      const okBrand = brand === "todas" || p.brand === brand;
      const okPrice = p.price/100 <= maxPrice;
      return okQ && okCat && okBrand && okPrice;
    });
  }, [q, category, brand, maxPrice]);

  // ---------- carrinho ----------
  const inc = (p: Product) => {
    setCart(c => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
    setMiniOpen(true);
    flash("Produto adicionado ✅");
  };
  const dec = (id: string) => setCart(c => {
    const q = (c[id] ?? 0) - 1;
    const n = { ...c };
    if (q <= 0) delete n[id]; else n[id] = q;
    return n;
  });
  const clear = () => setCart({});

  const lines = useMemo(() => Object.entries(cart).map(([id, qty]) => {
    const p = ALL.find(pp => pp.id === id)!;
    return { ...p, qty, lineTotal: p.price * qty };
  }), [cart]);

  const subtotal = lines.reduce((acc, l) => acc + l.lineTotal, 0);

  // ---------- pedido (texto pra copiar/enviar) ----------
  const orderSummaryText = () => {
    const itens = lines.map(l => `• ${l.name} x${l.qty} — ${formatBRL(l.price)} (total ${formatBRL(l.lineTotal)})`).join("\n");
    return [
      `*Pedido - Loja da Jane*`,
      "",
      itens || "(sem itens)",
      "",
      `Total: *${formatBRL(subtotal)}*`,
      "",
      `Pagamento: PIX (${PIX}) ou combinar no WhatsApp.`,
    ].join("\n");
  };

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(orderSummaryText());
      flash("Pedido copiado ✔");
    } catch { /* ignore */ }
  };

  const whatsCheckout = () => {
    const text = encodeURIComponent(orderSummaryText());
    const url = `https://wa.me/${WHATS_E164}?text=${text}`;
    window.open(url, "_blank");
  };

  // ---------- ui ----------
  const flash = (msg: string) => {
    setToast(msg);
    clearTimeout((flash as any)._t);
    (flash as any)._t = setTimeout(()=>setToast(null), 1400);
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* top */}
      <div className="border-b border-white/10 sticky top-0 z-20 backdrop-blur bg-neutral-900/70">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="text-sm">Bem-vinda à <b>Loja da Jane</b> ✨</div>
          <nav className="hidden sm:flex gap-6 text-sm text-zinc-300">
            <Link href="/">Home</Link>
            <Link href="/conta">Conta</Link>
            <Link href="/politica-privacidade">Privacidade</Link>
            <Link href="/trocas">Trocas</Link>
          </nav>
          <button onClick={()=>setMiniOpen(true)} className="text-sm px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-800">
            Carrinho ({Object.values(cart).reduce((a,b)=>a+b,0)}) — {formatBRL(subtotal)}
          </button>
        </div>
      </div>

      {/* hero */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-neutral-800">
          <Image src="/banner.jpg" alt="Banner" width={1600} height={600} className="w-full h-auto" priority />
        </div>
      </section>

      {/* filtros */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <Filters
          q={q} setQ={setQ}
          category={category} setCategory={setCategory}
          brand={brand} setBrand={setBrand}
          price={maxPrice} setPrice={setMaxPrice}
        />
      </section>

      {/* catálogo */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Produtos</h2>
        {filtered.length === 0 ? (
          <div className="text-zinc-400">Nada encontrado com esses filtros.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map(p => (
              <article key={p.id} className="rounded-2xl overflow-hidden border border-zinc-800 bg-neutral-900">
                <Link href={`/p/${p.slug}`}>
                  <Image src={p.image} alt={p.name} width={1000} height={800} className="w-full h-auto"/>
                </Link>
                <div className="p-4">
                  <div className="text-sm text-zinc-400">{p.brand ?? "—"} · {p.category}</div>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <div className="text-emerald-400 font-semibold">{formatBRL(p.price)}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={()=>inc(p)} className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white">Adicionar</button>
                    <Link href={`/p/${p.slug}`} className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800">Ver</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* pagamento rápido */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <h2 className="text-2xl font-semibold mb-3">Pagamento & Contato</h2>
        <div className="rounded-2xl border border-zinc-800 bg-neutral-900 p-4 space-y-3">
          <div className="text-sm text-zinc-400">Chave PIX</div>
          <div className="flex gap-2 items-center">
            <code className="px-3 py-2 rounded bg-neutral-950 border border-zinc-800">{PIX}</code>
            <button onClick={async()=>{ await navigator.clipboard.writeText(PIX); flash("Chave PIX copiada ✔"); }} className="px-3 py-2 rounded border border-zinc-700 hover:bg-zinc-800">
              Copiar chave
            </button>
          </div>
        </div>
        <footer className="text-center text-zinc-400 mt-8">© {new Date().getFullYear()} Loja da Jane — feito com 💚</footer>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl">
          {toast}
        </div>
      )}

      {/* MiniCart */}
      <MiniCart
        open={miniOpen}
        onClose={()=>setMiniOpen(false)}
        lines={lines}
        totalCents={subtotal}
        onInc={(id)=>inc(ALL.find(p=>p.id===id)!)}
        onDec={dec}
        onClear={clear}
        onCopyOrder={copyOrder}
        onWhatsCheckout={whatsCheckout}
      />
    </main>
  );
}
