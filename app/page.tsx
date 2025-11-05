"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { products, formatBRL, findBySlug, type Product } from "../lib/products";

type CartItem = { id: string; qty: number };

type Address = {
  name: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  uf: string;
  note: string; // observação
};

export default function Page() {
  // ----------------- CARRINHO -----------------
  const [cart, setCart] = useState<CartItem[]>([]);
  const add = (p: Product) =>
    setCart((c) => {
      const i = c.findIndex((x) => x.id === p.id);
      if (i >= 0) {
        const copy = [...c];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...c, { id: p.id, qty: 1 }];
    });
  const sub = (id: string) =>
    setCart((c) => {
      const i = c.findIndex((x) => x.id === id);
      if (i < 0) return c;
      const item = c[i];
      if (item.qty <= 1) return c.filter((x) => x.id !== id);
      const copy = [...c];
      copy[i] = { ...item, qty: item.qty - 1 };
      return copy;
    });
  const emptyCart = () => setCart([]);

  const cartLines = useMemo(
    () =>
      cart
        .map((line) => {
          const p = products.find((pp) => pp.id === line.id);
          if (!p) return null;
          return { ...p, qty: line.qty, lineTotal: p.price * line.qty };
        })
        .filter(Boolean) as Array<Product & { qty: number; lineTotal: number }>,
    [cart]
  );

  const totalCents = cartLines.reduce((acc, l) => acc + l.lineTotal, 0);

  // ----------------- ENDEREÇOS -----------------
  const [ship, setShip] = useState<Address>({
    name: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    uf: "",
    note: "",
  });
  const [billSame, setBillSame] = useState(true);
  const [bill, setBill] = useState<Address>({
    name: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    uf: "",
    note: "",
  });

  const onShip = (k: keyof Address, v: string) =>
    setShip((s) => ({ ...s, [k]: v }));
  const onBill = (k: keyof Address, v: string) =>
    setBill((s) => ({ ...s, [k]: v }));

  // ----------------- PIX / WHATS -----------------
  const [copiedPix, setCopiedPix] = useState(false);
  const pixKey = "44988606483";
  const waNumber = "5544988606483"; // +55 44 98860-6483

  const waText = useMemo(() => {
    const items = cartLines
      .map(
        (l) =>
          `• ${l.name} x${l.qty} — ${formatBRL(l.price)} (total ${formatBRL(
            l.lineTotal
          )})`
      )
      .join("%0A");

    const address = [
      ship.name && `Nome: ${ship.name}`,
      ship.cep && `CEP: ${ship.cep}`,
      ship.street && `Rua: ${ship.street}, nº ${ship.number || "s/n"}`,
      ship.district && `Bairro: ${ship.district}`,
      ship.city && `Cidade: ${ship.city} - ${ship.uf}`,
      ship.complement && `Compl.: ${ship.complement}`,
      ship.note && `Obs.: ${ship.note}`,
    ]
      .filter(Boolean)
      .join("%0A");

    const header = `Olá! Quero finalizar meu pedido 🛍️`;
    const body =
      cartLines.length > 0
        ? `%0A%0A*Itens*:%0A${items}%0A%0A*Total:* ${formatBRL(
            totalCents
          )}%0A%0A*Entrega*:%0A${address || "Informarei após"}`
        : `%0A(Sem itens no carrinho)`;

    return encodeURIComponent(`${header}${decodeURIComponent(body)}`);
  }, [cartLines, ship, totalCents]);

  const waLink = `https://wa.me/${waNumber}?text=${waText}`;

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    } catch {
      // no-op
    }
  };

  const finalizarDisabled = cartLines.length === 0;

  // ----------------- UI -----------------
  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Topbar */}
      <div className="border-b border-white/10 sticky top-0 z-30 backdrop-blur bg-neutral-900/80">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
          <div className="text-sm">
            Bem-vinda à <b>Loja da Jane</b>{" "}
            <span className="ml-2">✨</span>
          </div>
          <div className="text-sm">
            Carrinho: {cartLines.length} itens —{" "}
            <b>{formatBRL(totalCents)}</b>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-2">
        <div className="overflow-hidden rounded-2xl bg-neutral-800">
          <Image
            src="/banner.jpg"
            alt="Promoções da Loja da Jane"
            width={1600}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href="#produtos"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-center text-lg font-semibold py-3"
          >
            Ver produtos
          </a>

          <a
            href={finalizarDisabled ? undefined : waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-xl text-center text-lg font-semibold py-3 transition ${
              finalizarDisabled
                ? "bg-neutral-700 cursor-not-allowed"
                : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            Finalizar no WhatsApp
          </a>

          <button
            onClick={emptyCart}
            className="rounded-xl bg-neutral-800 hover:bg-neutral-700 transition text-center text-lg font-semibold py-3"
            disabled={finalizarDisabled}
          >
            Esvaziar carrinho
          </button>
        </div>
      </section>

      {/* Benefícios */}
      <section className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-sky-900/40 p-5">
          <div className="text-lg font-semibold">30 dias para troca</div>
          <div className="text-neutral-300">Sem estresse</div>
        </div>
        <div className="rounded-2xl bg-amber-900/40 p-5">
          <div className="text-lg font-semibold">Frete grátis*</div>
          <div className="text-neutral-300">Consulte condições</div>
        </div>
        <div className="rounded-2xl bg-rose-900/40 p-5">
          <div className="text-lg font-semibold">Pagamentos seguros</div>
          <div className="text-neutral-300">Pix, Cartão</div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Últimos Produtos</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {products.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl overflow-hidden bg-neutral-800"
            >
              <Link href={`/p/${p.slug}`} prefetch>
                <Image
                  src={p.image}
                  alt={p.name}
                  width={1200}
                  height={900}
                  className="w-full h-auto"
                />
              </Link>

              <div className="p-4">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <div className="text-emerald-400 font-semibold mt-1">
                  {formatBRL(p.price)}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition py-2 font-semibold"
                    onClick={() => add(p)}
                  >
                    Adicionar
                  </button>

                  <Link
                    className="rounded-xl bg-neutral-700 hover:bg-neutral-600 transition py-2 px-4 font-semibold"
                    href={`/p/${p.slug}`}
                    prefetch
                  >
                    Ver
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Carrinho */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Carrinho</h2>

        {cartLines.length === 0 ? (
          <div className="rounded-xl border border-white/10 p-4 text-neutral-300">
            Seu carrinho está vazio.
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 divide-y divide-white/10 overflow-hidden">
            {cartLines.map((l) => (
              <div key={l.id} className="p-4 flex items-center gap-4">
                <Image
                  src={l.image}
                  alt={l.name}
                  width={80}
                  height={80}
                  className="rounded-lg bg-neutral-700"
                />
                <div className="flex-1">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-sm text-neutral-300">
                    {formatBRL(l.price)} × {l.qty}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 rounded-lg bg-neutral-700 hover:bg-neutral-600"
                    onClick={() => sub(l.id)}
                    aria-label="Diminuir"
                  >
                    –
                  </button>
                  <span className="w-6 text-center">{l.qty}</span>
                  <button
                    className="w-8 h-8 rounded-lg bg-neutral-700 hover:bg-neutral-600"
                    onClick={() => add(l)}
                    aria-label="Aumentar"
                  >
                    +
                  </button>
                </div>
                <div className="w-28 text-right font-semibold">
                  {formatBRL(l.lineTotal)}
                </div>
              </div>
            ))}

            <div className="p-4 flex items-center justify-between">
              <div className="text-lg">Total:</div>
              <div className="text-xl font-bold">{formatBRL(totalCents)}</div>
            </div>
          </div>
        )}
      </section>

      {/* Endereço de Entrega */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Endereço de Entrega</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome completo"
            value={ship.name}
            onChange={(v) => onShip("name", v)}
          />
          <Input
            label="CEP"
            value={ship.cep}
            onChange={(v) => onShip("cep", v)}
            placeholder="00000-000"
          />
          <Input
            label="Rua"
            value={ship.street}
            onChange={(v) => onShip("street", v)}
            className="sm:col-span-2"
          />
          <Input
            label="Número"
            value={ship.number}
            onChange={(v) => onShip("number", v)}
          />
          <Input
            label="Complemento"
            value={ship.complement}
            onChange={(v) => onShip("complement", v)}
          />
          <Input
            label="Bairro"
            value={ship.district}
            onChange={(v) => onShip("district", v)}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Cidade"
              value={ship.city}
              onChange={(v) => onShip("city", v)}
              className="col-span-2"
            />
            <Input
              label="UF"
              value={ship.uf}
              onChange={(v) => onShip("uf", v.toUpperCase().slice(0, 2))}
            />
          </div>
          <Input
            label="Observação (ex.: portaria, referência)"
            value={ship.note}
            onChange={(v) => onShip("note", v)}
            className="sm:col-span-2"
          />
        </div>
      </section>

      {/* Endereço de Cobrança */}
      <section className="mx-auto max-w-6xl px-4 pt-2 pb-6">
        <h2 className="text-2xl font-bold mb-4">Endereço de Cobrança</h2>

        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={billSame}
            onChange={(e) => setBillSame(e.target.checked)}
          />
          <span>Usar mesmo endereço da entrega</span>
        </label>

        {!billSame && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nome completo"
              value={bill.name}
              onChange={(v) => onBill("name", v)}
            />
            <Input
              label="CEP"
              value={bill.cep}
              onChange={(v) => onBill("cep", v)}
              placeholder="00000-000"
            />
            <Input
              label="Rua"
              value={bill.street}
              onChange={(v) => onBill("street", v)}
              className="sm:col-span-2"
            />
            <Input
              label="Número"
              value={bill.number}
              onChange={(v) => onBill("number", v)}
            />
            <Input
              label="Complemento"
              value={bill.complement}
              onChange={(v) => onBill("complement", v)}
            />
            <Input
              label="Bairro"
              value={bill.district}
              onChange={(v) => onBill("district", v)}
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Cidade"
                value={bill.city}
                onChange={(v) => onBill("city", v)}
                className="col-span-2"
              />
              <Input
                label="UF"
                value={bill.uf}
                onChange={(v) => onBill("uf", v.toUpperCase().slice(0, 2))}
              />
            </div>
          </div>
        )}
      </section>

      {/* Contato / PIX */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-bold mb-4">Pagamento & Contato</h2>

        <div className="rounded-2xl border border-white/10 p-4">
          <div className="mb-2">
            <div className="text-neutral-300 text-sm">WhatsApp</div>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline underline-offset-4"
            >
              +55 (44) 98860-6483
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div>
              <div className="text-neutral-300 text-sm">Chave PIX</div>
              <div className="px-4 py-2 rounded-lg bg-neutral-800 inline-block select-all">
                {pixKey}
              </div>
            </div>

            <button
              onClick={handleCopyPix}
              className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition font-semibold"
            >
              {copiedPix ? "Copiado ✓" : "Copiar chave"}
            </button>
          </div>

          <p className="text-neutral-300 mt-4">
            Aceitamos PIX e Cartão. Entregas/retirada combinadas no WhatsApp.
          </p>
        </div>

        <p className="mt-8 text-center text-neutral-400">
          © 2025 Loja da Jane — feito com amor 💚
        </p>
      </section>
    </main>
  );
}

// ----------------- INPUT COMPONENT -----------------
function Input({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className || ""}`}>
      <span className="block text-sm text-neutral-300 mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 outline-none focus:border-emerald-500"
      />
    </label>
  );
}
