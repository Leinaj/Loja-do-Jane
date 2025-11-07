"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { money, Product } from "@/lib/products";
import { useCart } from "@/components/CartContext"; // mantém seu hook/contexto atual

type Address = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export default function CheckoutPage() {
  const { items, total } = useCart(); // items: { product: Product; qty: number }[]
  const [addr, setAddr] = useState<Address>({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  // auto-preencher endereço quando o CEP tiver 8 dígitos numéricos
  useEffect(() => {
    const onlyDigits = addr.cep.replace(/\D/g, "");
    if (onlyDigits.length === 8) {
      fetch(`https://viacep.com.br/ws/${onlyDigits}/json/`)
        .then((r) => r.json())
        .then((data) => {
          if (!data?.erro) {
            setAddr((a) => ({
              ...a,
              logradouro: data.logradouro ?? "",
              bairro: data.bairro ?? "",
              cidade: data.localidade ?? "",
              estado: data.uf ?? "",
            }));
          }
        })
        .catch(() => {});
    }
  }, [addr.cep]);

  const handleChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddr((a) => ({ ...a, [field]: e.target.value }));

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-lg font-semibold">
          Loja da Jane
        </Link>

        <div className="text-sm opacity-80">
          Total do carrinho: <strong>{money(total)}</strong>
        </div>
      </div>

      {/* Formulário de entrega */}
      <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-8">
        <h2 className="text-2xl font-bold mb-4">Dados para entrega</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            placeholder="CEP"
            value={addr.cep}
            onChange={handleChange("cep")}
            inputMode="numeric"
          />
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            placeholder="Telefone (WhatsApp)"
          />
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 md:col-span-2 outline-none"
            placeholder="Endereço (logradouro)"
            value={addr.logradouro}
            onChange={handleChange("logradouro")}
          />
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            placeholder="Número"
            value={addr.numero}
            onChange={handleChange("numero")}
          />
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            placeholder="Complemento"
            value={addr.complemento}
            onChange={handleChange("complemento")}
          />
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            placeholder="Bairro"
            value={addr.bairro}
            onChange={handleChange("bairro")}
          />
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            placeholder="Cidade"
            value={addr.cidade}
            onChange={handleChange("cidade")}
          />
          <input
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
            placeholder="Estado"
            value={addr.estado}
            onChange={handleChange("estado")}
          />
        </div>

        <button className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 transition rounded-xl px-4 py-3 font-semibold">
          Finalizar pedido
        </button>

        <p className="text-sm opacity-70 mt-3">
          Ao finalizar, os dados são mostrados e o carrinho limpa. Depois
          integramos pagamento/PIX/WhatsApp.
        </p>
      </section>

      {/* Resumo do carrinho */}
      <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-xl font-semibold mb-4">Seu carrinho</h3>

        <div className="space-y-4">
          {items.map(({ product, qty }) => (
            <div
              key={product.slug} // <<< trocado de product.id para product.slug
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {/* imagem */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-cover border border-zinc-800"
                />
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm opacity-70">
                    {qty} × {money(product.price)}
                  </p>
                </div>
              </div>

              <div className="font-semibold">
                {money(product.price * qty)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 mt-4 pt-4 flex items-center justify-between">
          <span className="opacity-80">Total</span>
          <span className="text-lg font-bold">{money(total)}</span>
        </div>
      </section>
    </main>
  );
}