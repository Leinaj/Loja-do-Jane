// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BRANDS, money, PRODUCTS, Product } from "@/lib/products";

// ====== CONFIG RÁPIDA ======
const WHATSAPP_E164 = "5544988606483"; // troque se precisar
const PIX_CHAVE = "44988606483";       // troque se precisar
// ===========================

type Cart = Record<string, number>;

type Address = {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

const emptyAddress: Address = {
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

const addrToText = (a: Address) => {
  const linhas = [
    `CEP: ${a.cep}`,
    `${a.rua}, ${a.numero}${a.complemento ? " - " + a.complemento : ""}`,
    `Bairro: ${a.bairro}`,
    `${a.cidade} - ${a.uf}`
  ];
  return linhas.join("\n");
};

export default function HomePage() {
  // Carrinho
  const [cart, setCart] = useState<Cart>({});
  // PIX
  const [copiouPix, setCopiouPix] = useState(false);

  // Endereços separadinhos
  const [shipping, setShipping] = useState<Address>({ ...emptyAddress });
  const [billing, setBilling]   = useState<Address>({ ...emptyAddress });
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Carrega do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setCart(JSON.parse(raw));

      const s = localStorage.getItem("shippingAddr");
      if (s) setShipping(JSON.parse(s));

      const b = localStorage.getItem("billingAddr");
      if (b) setBilling(JSON.parse(b));

      const same = localStorage.getItem("sameAsShipping");
      if (same) setSameAsShipping(JSON.parse(same));
    } catch {}
  }, []);

  // Salva carrinho
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Salva endereços
  useEffect(() => {
    localStorage.setItem("shippingAddr", JSON.stringify(shipping));
  }, [shipping]);

  useEffect(() => {
    localStorage.setItem("billingAddr", JSON.stringify(billing));
  }, [billing]);

  useEffect(() => {
    localStorage.setItem("sameAsShipping", JSON.stringify(sameAsShipping));
  }, [sameAsShipping]);

  const totalCents = useMemo(() => {
    return Object.entries(cart).reduce((acc, [id, qty]) => {
      const p = PRODUCTS.find(pr => pr.id === id);
      return p ? acc + p.price * qty : acc;
    }, 0);
  }, [cart]);

  const itemsList = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const p = PRODUCTS.find(pr => pr.id === id);
        return p ? `• ${p.name} x${qty} — ${money(p.price * qty)}` : null;
      })
      .filter(Boolean)
      .join("\n");
  }, [cart]);

  const finalizarDisabled =
    Object.keys(cart).length === 0 ||
    !shipping.cep || !shipping.rua || !shipping.numero || !shipping.cidade || !shipping.uf ||
    (!sameAsShipping && (!billing.cep || !billing.rua || !billing.numero || !billing.cidade || !billing.uf));

  const waText = useMemo(() => {
    const linhas: string[] = [];
    linhas.push("*Pedido - Loja da Jane*");
    linhas.push("");
    if (itemsList) {
      linhas.push(itemsList);
      linhas.push(`Total: *${money(totalCents)}*`);
      linhas.push("");
    }
    linhas.push("*ENDEREÇO DE ENTREGA*");
    linhas.push(addrToText(shipping));

    if (sameAsShipping) {
      linhas.push("");
      linhas.push("_Endereço de cobrança igual ao de entrega._");
    } else {
      linhas.push("");
      linhas.push("*ENDEREÇO DE COBRANÇA*");
      linhas.push(addrToText(billing));
    }

    return linhas.join("\n");
  }, [itemsList, totalCents, shipping, billing, sameAsShipping]);

  const waLink = `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(waText)}`;

  // CEP → auto-preencher via ViaCEP
  const fetchCEP = async (cep: string, target: "shipping" | "billing") => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data?.erro) return;

      const next: Address = {
        cep: formatCEP(clean),
        rua: data.logradouro ?? "",
        numero: "",
        complemento: data.complemento ?? "",
        bairro: data.bairro ?? "",
        cidade: data.localidade ?? "",
        uf: data.uf ?? "",
      };
      if (target === "shipping") setShipping(prev => ({ ...prev, ...next }));
      else setBilling(prev => ({ ...prev, ...next }));
    } catch { /* silencioso */ }
  };

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CHAVE);
      setCopiouPix(true);
      setTimeout(() => setCopiouPix(false), 2000);
    } catch {}
  };

  const inc = (p: Product) => setCart(c => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart(c => {
      const q = (c[id] ?? 0) - 1;
      const n = { ...c };
      if (q <= 0) delete n[id];
      else n[id] = q;
      return n;
    });

  const setAddr = (which: "shipping" | "billing", field: keyof Address, v: string) => {
    const set = which === "shipping" ? setShipping : setBilling;
    set(prev => ({ ...prev, [field]: v }));
  };

  // Se marcar "mesmo endereço", espelha visualmente (mensagem já trata)
  useEffect(() => {
    if (sameAsShipping) {
      // nada a persistir no billing; só não mostrar os campos
    }
  }, [sameAsShipping, shipping]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Topbar */}
      <div className="border-b border-zinc-800 bg-black/60">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between text-sm">
          <div>
            Bem-vinda à <b>Loja da Jane</b> ✨
          </div>
          <div className="hidden sm:flex gap-6 text-zinc-400">
            <Link href="/" className="hover:text-zinc-200">Home</Link>
            <a href="#catalogo" className="hover:text-zinc-200">Catálogo</a>
            <a href="#contato" className="hover:text-zinc-200">Contato</a>
          </div>
          <div className="text-zinc-400">
            Carrinho: {Object.values(cart).reduce((a,b)=>a+b,0)} itens — {money(totalCents)}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Banner + CTA */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">
            <Image src="/banner.jpg" alt="Banner" width={1200} height={500} className="w-full h-auto" priority />
          </div>
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6">
            <h1 className="text-3xl font-semibold mb-2">
              iPhone 6 <span className="text-emerald-400">Plus</span>
            </h1>
            <p className="text-zinc-300 mb-6">
              Exemplo de banner. Para trocar, substitua o arquivo <code className="bg-zinc-800 px-2 py-1 rounded">/public/banner.jpg</code>.
            </p>
            <div className="flex gap-3">
              <a href="#catalogo" className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white">Ver produtos</a>
              <a
                href={finalizarDisabled ? undefined : waLink}
                aria-disabled={finalizarDisabled}
                className={`px-5 py-3 rounded-xl border ${finalizarDisabled ? "border-zinc-700 text-zinc-500 cursor-not-allowed" : "border-zinc-700 hover:bg-zinc-800"}`}
              >
                Finalizar no WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* USPs */}
        <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { t: "30 dias para troca", s: "Sem estresse", c: "bg-sky-950/40" },
            { t: "Frete grátis*", s: "Consulte condições", c: "bg-amber-950/40" },
            { t: "Pagamentos seguros", s: "Pix, Cartão", c: "bg-rose-950/40" },
            { t: "Novidades semanais", s: "Sempre tem coisa nova", c: "bg-teal-950/40" },
          ].map((u, i) => (
            <div key={i} className={`rounded-2xl p-5 border border-zinc-800 ${u.c}`}>
              <div className="text-lg font-medium">{u.t}</div>
              <div className="text-zinc-400">{u.s}</div>
            </div>
          ))}
        </section>

        {/* Brands */}
        <section className="mt-8 rounded-2xl p-6 border border-zinc-800 bg-zinc-900">
          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-6 opacity-90">
            {BRANDS.map(b => (
              <div key={b.name} className="flex items-center justify-center">
                <Image src={b.logo} alt={b.name} width={160} height={60} />
              </div>
            ))}
          </div>
        </section>

        {/* Catálogo */}
        <section id="catalogo" className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Últimos Produtos</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {PRODUCTS.map(p => (
              <div key={p.id} className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <Link href={`/p/${p.id}`}>
                  <Image src={p.image} alt={p.name} width={600} height={600} className="w-full h-auto" />
                </Link>
                <div className="p-4">
                  <div className="text-lg">{p.name}</div>
                  <div className="text-emerald-400 font-semibold">{money(p.price)}</div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => inc(p)}
                      className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Adicionar
                    </button>
                    <Link
                      href={`/p/${p.id}`}
                      className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Carrinho */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Carrinho</h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            {Object.keys(cart).length === 0 ? (
              <div className="text-zinc-400">Seu carrinho está vazio.</div>
            ) : (
              <ul className="space-y-3">
                {Object.entries(cart).map(([id, qty]) => {
                  const p = PRODUCTS.find(pr => pr.id === id)!;
                  return (
                    <li key={id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image src={p.image} alt={p.name} width={56} height={56} className="rounded-md border border-zinc-800"/>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-zinc-400 text-sm">{money(p.price)} x {qty}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => dec(id)} className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800">-</button>
                        <button onClick={() => inc(p)} className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800">+</button>
                      </div>
                    </li>
                  );
                })}
                <li className="pt-3 border-t border-zinc-800 text-right font-semibold">
                  Total: {money(totalCents)}
                </li>
              </ul>
            )}
          </div>
        </section>

        {/* Endereço de ENTREGA */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Endereço de Entrega</h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">CEP</label>
              <input
                value={shipping.cep}
                onChange={(e) => setAddr("shipping", "cep", maskCEP(e.target.value))}
                onBlur={() => fetchCEP(shipping.cep, "shipping")}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                placeholder="00000-000"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Rua</label>
              <input
                value={shipping.rua}
                onChange={(e) => setAddr("shipping", "rua", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Número</label>
              <input
                value={shipping.numero}
                onChange={(e) => setAddr("shipping", "numero", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Complemento</label>
              <input
                value={shipping.complemento}
                onChange={(e) => setAddr("shipping", "complemento", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Bairro</label>
              <input
                value={shipping.bairro}
                onChange={(e) => setAddr("shipping", "bairro", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-zinc-400 mb-1">Cidade</label>
                <input
                  value={shipping.cidade}
                  onChange={(e) => setAddr("shipping", "cidade", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">UF</label>
                <input
                  value={shipping.uf}
                  onChange={(e) => setAddr("shipping", "uf", e.target.value.toUpperCase().slice(0,2))}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Endereço de COBRANÇA */}
        <section className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-2xl font-semibold">Endereço de Cobrança</h2>
            <label className="ml-auto flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
              />
              Usar mesmo endereço da entrega
            </label>
          </div>

          {!sameAsShipping && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">CEP</label>
                <input
                  value={billing.cep}
                  onChange={(e) => setAddr("billing", "cep", maskCEP(e.target.value))}
                  onBlur={() => fetchCEP(billing.cep, "billing")}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                  placeholder="00000-000"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Rua</label>
                <input
                  value={billing.rua}
                  onChange={(e) => setAddr("billing", "rua", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Número</label>
                <input
                  value={billing.numero}
                  onChange={(e) => setAddr("billing", "numero", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Complemento</label>
                <input
                  value={billing.complemento}
                  onChange={(e) => setAddr("billing", "complemento", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Bairro</label>
                <input
                  value={billing.bairro}
                  onChange={(e) => setAddr("billing", "bairro", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-zinc-400 mb-1">Cidade</label>
                  <input
                    value={billing.cidade}
                    onChange={(e) => setAddr("billing", "cidade", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">UF</label>
                  <input
                    value={billing.uf}
                    onChange={(e) => setAddr("billing", "uf", e.target.value.toUpperCase().slice(0,2))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Pagamento & Contato */}
        <section id="contato" className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Pagamento & Contato</h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-4">
            <div>
              <div className="text-zinc-400 text-sm mb-1">WhatsApp</div>
              <a href={`https://wa.me/${WHATSAPP_E164}`} target="_blank" className="text-emerald-400 underline">
                +55 (44) 98860-6483
              </a>
            </div>

            <div>
              <div className="text-zinc-400 text-sm mb-1">Chave PIX</div>
              <div className="flex gap-2 items-center">
                <code className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  {PIX_CHAVE}
                </code>
                <button
                  onClick={copyPix}
                  className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800"
                >
                  {copiouPix ? "Copiado ✔" : "Copiar chave"}
                </button>
              </div>
              <p className="text-zinc-400 mt-2">
                Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
              </p>
            </div>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="text-center text-zinc-400 py-10">
          © {new Date().getFullYear()} Loja da Jane — feito com amor 💚
        </footer>
      </div>
    </main>
  );
}

// ====== helpers locais ======
function maskCEP(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 8);
  if (n.length <= 5) return n;
  return n.slice(0,5) + "-" + n.slice(5);
}
function formatCEP(n: string) {
  const clean = n.replace(/\D/g, "");
  return clean.length === 8 ? clean.slice(0,5) + "-" + clean.slice(5) : n;
}
