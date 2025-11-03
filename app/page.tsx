"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number; // em centavos
  image: string;
  category: string;
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "Camiseta Básica", price: 6990, image: "https://via.placeholder.com/800x600?text=Camiseta", category: "Roupas" },
  { id: "p2", name: "Boné Street",    price: 4590, image: "https://via.placeholder.com/800x600?text=Bon%C3%A9",  category: "Acessórios" },
  { id: "p3", name: "Tênis Casual",    price: 18990,image: "https://via.placeholder.com/800x600?text=T%C3%AAnis", category: "Calçados" },
  { id: "p4", name: "Fone Bluetooth",  price: 12990,image: "https://via.placeholder.com/800x600?text=Fone",       category: "Eletrônicos" },
  { id: "p5", name: "Relógio Digital", price: 9990, image: "https://via.placeholder.com/800x600?text=Rel%C3%B3gio",category: "Acessórios" },
  { id: "p6", name: "Mochila Urban",   price: 14990,image: "https://via.placeholder.com/800x600?text=Mochila",    category: "Bolsas" },
];

// TROQUE AQUI pelo seu WhatsApp (ex.: 55DDD9XXXXXXXX)
const WHATSAPP = "55SEUNUMERO";

type CartItem = { product: Product; qty: number };

const toBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  function add(p: Product) {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.product.id === p.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...prev, { product: p, qty: 1 }];
    });
    setOpen(true);
  }

  const inc = (id: string) =>
    setCart((prev) => prev.map((x) => (x.product.id === id ? { ...x, qty: x.qty + 1 } : x)));
  const dec = (id: string) =>
    setCart((prev) =>
      prev
        .map((x) => (x.product.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))
        .filter((x) => x.qty > 0)
    );
  const remove = (id: string) => setCart((prev) => prev.filter((x) => x.product.id !== id));
  const clear = () => setCart([]);

  const total = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.qty, 0), [cart]);

  const waLink = useMemo(() => {
    if (!cart.length) return "#";
    const lines = cart
      .map((i) => `- ${i.qty}x ${i.product.name} (${toBRL(i.product.price)})`)
      .join("%0A");
    const msg =
      `Olá! Quero finalizar meu pedido:%0A%0A${lines}` +
      `%0A%0ATotal: ${toBRL(total)}%0A%0ANome:%0AEndereço:%0AForma de pagamento:`;
    return `https://wa.me/${WHATSAPP}?text=${msg}`;
  }, [cart, total]);

  return (
    <div className="container">
      <header className="header">
        <div className="brand">🛍️ Loja da Jane</div>
        <button className="cartBtn" onClick={() => setOpen(true)}>
          Carrinho <span className="badge">{cart.reduce((s, i) => s + i.qty, 0)}</span>
        </button>
      </header>

      <section className="products">
        {PRODUCTS.map((p) => (
          <article className="card" key={p.id}>
            <img src={p.image} alt={p.name} />
            <div className="info">
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div className="price">{toBRL(p.price)}</div>
              <button className="addBtn" onClick={() => add(p)}>Adicionar</button>
              <small style={{ opacity: 0.7 }}>{p.category}</small>
            </div>
          </article>
        ))}
      </section>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}
      <aside className={`drawer ${open ? "show" : ""}`} aria-hidden={!open}>
        <div className="drawerHeader">
          <strong>Seu carrinho</strong>
          <button className="clear" onClick={() => setOpen(false)}>Fechar</button>
        </div>

        <div className="items">
          {cart.length === 0 && <div className="empty">Carrinho vazio 😴</div>}
          {cart.map((i) => (
            <div className="item" key={i.product.id}>
              <img src={i.product.image} alt={i.product.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{i.product.name}</div>
                <div style={{ opacity: 0.8 }}>{toBRL(i.product.price)}</div>
              </div>
              <div className="qty">
                <button onClick={() => dec(i.product.id)}>-</button>
                <div>{i.qty}</div>
                <button onClick={() => inc(i.product.id)}>+</button>
              </div>
              <button className="remove" onClick={() => remove(i.product.id)}>x</button>
            </div>
          ))}
        </div>

        <div className="total">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total</span>
            <strong>{toBRL(total)}</strong>
          </div>
          <a href={waLink} target="_blank">
            <button
              className="checkout"
              disabled={!cart.length || WHATSAPP === "55SEUNUMERO"}
              style={{ width: "100%" }}
            >
              Finalizar no WhatsApp
            </button>
          </a>
          <button className="clear" onClick={clear} disabled={!cart.length}>
            Limpar carrinho
          </button>
          {WHATSAPP === "55SEUNUMERO" && (
            <small style={{ opacity: 0.7 }}>
              Troque o número WHATSAPP no arquivo <b>app/page.tsx</b> (formato <code>55DDD9XXXXXXXX</code>) para ativar o botão.
            </small>
          )}
        </div>
      </aside>
    </div>
  );
}
