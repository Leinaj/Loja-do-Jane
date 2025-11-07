"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { priceBRL } from "@/lib/products";
import { useCart } from "@/components/CartContext";

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

export default function CheckoutPage() {
  const { items, remove, clear, total } = useCart();

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

  // auto-preenche endereço pelo CEP (ViaCEP)
  useEffect(() => {
    const onlyDigits = address.cep.replace(/\D/g, "");
    if (onlyDigits.length !== 8) return;

    const fetchCep = async () => {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${onlyDigits}/json/`);
        const data = await res.json();

        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } catch {
        // silencioso – se der erro, o usuário pode digitar manualmente
      }
    };

    fetchCep();
  }, [address.cep]);

  const onChange =
    (key: keyof Address) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const hasItems = items.length > 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="btn-outline">
          Loja da Jane
        </Link>
        <Link href="/" className="btn">
          Voltar para loja
        </Link>
      </header>

      <h1 className="text-2xl font-semibold mb-4">Dados para entrega</h1>

      <section className="rounded-xl border border-zinc-800 p-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Nome completo"
            value={address.name}
            onChange={onChange("name")}
          />
          <input
            className="input"
            placeholder="Telefone (WhatsApp)"
            value={address.phone}
            onChange={onChange("phone")}
          />
          <input
            className="input"
            placeholder="CEP"
            value={address.cep}
            onChange={onChange("cep")}
            inputMode="numeric"
            maxLength={9}
          />
          <input
            className="input"
            placeholder="Endereço"
            value={address.street}
            onChange={onChange("street")}
          />
          <input
            className="input"
            placeholder="Número"
            value={address.number}
            onChange={onChange("number")}
          />
          <input
            className="input"
            placeholder="Complemento"
            value={address.complement}
            onChange={onChange("complement")}
          />
          <input
            className="input"
            placeholder="Cidade"
            value={address.city}
            onChange={onChange("city")}
          />
          <input
            className="input"
            placeholder="Estado"
            value={address.state}
            onChange={onChange("state")}
          />
        </div>

        <p className="text-sm text-zinc-400 mt-4">
          Ao finalizar, os dados são mostrados e o carrinho limpa. Depois
          integramos pagamento/PIX/WhatsApp.
        </p>
      </section>

      <h2 className="text-xl font-semibold mb-3">Seu carrinho</h2>

      <section className="rounded-xl border border-zinc-800">
        {!hasItems ? (
          <div className="p-6 text-zinc-400">
            Carrinho vazio.{" "}
            <Link className="link" href="/">
              Voltar para a loja
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-zinc-400">
                    {priceBRL(product.price)}
                  </p>
                </div>

                <button
                  className="btn-outline"
                  onClick={() => remove(product.id)}
                  aria-label={`Remover ${product.name}`}
                >
                  Remover
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between pt-3">
              <span className="text-sm text-zinc-400">Total do carrinho:</span>
              <strong className="text-lg">{priceBRL(total())}</strong>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="btn-outline" onClick={clear}>
                Limpar carrinho
              </button>
              <button
                className="btn flex-1"
                onClick={() => {
                  alert(
                    `Pedido de ${address.name || "Cliente"} — Total: ${priceBRL(
                      total()
                    )}`
                  );
                  clear();
                }}
                disabled={!hasItems}
              >
                Finalizar pedido
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

/* utilidades de estilo tailwind em forma de classes utilitárias
   (caso você já tenha algo assim, pode remover) */
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      className?: string;
    }
  }
}