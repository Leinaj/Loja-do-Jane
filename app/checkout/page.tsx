"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useEffect, useState } from "react";

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
};

const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function CheckoutPage() {
  // >>> use o getCartTotal() em vez de 'total'
  const { items, remove, clear, getCartTotal } = useCart();

  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
  });

  // Autofill de endereço ao digitar CEP
  useEffect(() => {
    const cep = (address.cep || "").replace(/\D/g, "");
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.erro) {
            setAddress((prev) => ({
              ...prev,
              street: d.logradouro || "",
              city: d.localidade || "",
              state: d.uf || "",
            }));
          }
        })
        .catch(() => {});
    }
  }, [address.cep]);

  const total = getCartTotal();

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <Link href="/" className="btn">
          Loja da Jane
        </Link>
        <Link href="/checkout" className="btn">
          Checkout
        </Link>
      </header>

      <section className="card p-4 space-y-4">
        <h2 className="h2">Dados para entrega</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Nome completo"
            value={address.name}
            onChange={(e) => setAddress({ ...address, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Telefone (WhatsApp)"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
          />
          <input
            className="input"
            placeholder="CEP"
            value={address.cep}
            onChange={(e) => setAddress({ ...address, cep: e.target.value })}
          />
          <input
            className="input"
            placeholder="Endereço"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            className="input"
            placeholder="Número"
            value={address.number}
            onChange={(e) => setAddress({ ...address, number: e.target.value })}
          />
          <input
            className="input"
            placeholder="Complemento"
            value={address.complement}
            onChange={(e) =>
              setAddress({ ...address, complement: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Cidade"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            className="input"
            placeholder="Estado"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
        </div>

        <p className="text-sm opacity-70">
          Ao finalizar, os dados são mostrados e o carrinho limpa. Depois
          integramos pagamento/PIX/WhatsApp.
        </p>
      </section>

      <section className="card p-4 space-y-4">
        <h3 className="h3">Seu carrinho</h3>

        <div className="space-y-3">
          {items.length === 0 && <p>Seu carrinho está vazio.</p>}

          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{it.name}</p>
                <p className="text-sm opacity-70">
                  Qtd: {it.qty} • {formatBRL(it.price)}
                </p>
              </div>

              <button className="btn danger" onClick={() => remove(it.id)}>
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold">{formatBRL(total)}</span>
        </div>

        <div className="flex gap-3">
          <button className="btn" onClick={clear}>
            Limpar carrinho
          </button>
          <button
            className="btn primary"
            onClick={() =>
              alert(
                JSON.stringify(
                  { address, items, total: formatBRL(total) },
                  null,
                  2
                )
              )
            }
          >
            Finalizar pedido
          </button>
        </div>
      </section>
    </main>
  );
}