"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/context";

function brl(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export default function CheckoutPage() {
  const { items, total, removeItem, clearCart } = useCart();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("44988606483");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [buscando, setBuscando] = useState(false);

  // Preencher endereço automaticamente (ViaCEP)
  useEffect(() => {
    const c = cep.replace(/\D/g, "");
    if (c.length !== 8) return;
    setBuscando(true);
    fetch(`https://viacep.com.br/ws/${c}/json/`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.erro) {
          setRua(d.logradouro || "");
          setBairro(d.bairro || "");
          setCidade(d.localidade || "");
          setEstado(d.uf || "");
        }
      })
      .finally(() => setBuscando(false));
  }, [cep]);

  const msgWhats = useMemo(() => {
    const linhas = [
      "*Novo pedido*",
      "",
      "*Itens:*",
      ...items.map(
        (it) => `• ${it.name} — R$ ${brl(it.price)}`
      ),
      "",
      `*Total:* R$ ${brl(total)}`,
      "",
      "*Dados do cliente:*",
      `Nome: ${nome}`,
      `Telefone: ${telefone}`,
      `Endereço: ${rua}, ${numero} ${complemento ? "- " + complemento : ""}`,
      `Bairro: ${bairro}`,
      `Cidade/UF: ${cidade}/${estado}`,
      `CEP: ${cep}`,
    ];
    return linhas.join("\n");
  }, [items, total, nome, telefone, rua, numero, complemento, bairro, cidade, estado, cep]);

  const linkWhats = `https://wa.me/5544988606483?text=${encodeURIComponent(msgWhats)}`;

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="mb-6 text-3xl font-bold">Carrinho</h1>

      {/* Lista do carrinho com miniaturas */}
      <div className="mb-8 space-y-4">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between rounded-2xl bg-neutral-900 p-4">
            <div className="flex items-center gap-4">
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={it.image}
                  alt={it.name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-neutral-400">R$ {brl(it.price)}</div>
              </div>
            </div>
            <button
              className="rounded-xl bg-rose-700 px-4 py-2 text-white"
              onClick={() => removeItem(it.id)}
            >
              Remover
            </button>
          </div>
        ))}

        <div className="flex items-center justify-between rounded-2xl bg-neutral-900 p-4">
          <div className="text-xl">
            Total: <span className="font-semibold text-emerald-400">R$ {brl(total)}</span>
          </div>
          <button
            className="rounded-xl border border-white/20 px-4 py-2"
            onClick={() => clearCart()}
          >
            Limpar carrinho
          </button>
        </div>
      </div>

      {/* Endereço */}
      <h2 className="mb-4 text-2xl font-semibold">Endereço</h2>
      <div className="space-y-4">
        <input className="w-full rounded-xl bg-neutral-900 p-3" placeholder="Nome *" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input className="w-full rounded-xl bg-neutral-900 p-3" placeholder="Telefone *" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input className="w-full rounded-xl bg-neutral-900 p-3" placeholder="CEP *" value={cep} onChange={(e) => setCep(e.target.value)} />
        {buscando && <div className="text-sm text-neutral-400">Buscando endereço…</div>}
        <input className="w-full rounded-xl bg-neutral-900 p-3" placeholder="Rua *" value={rua} onChange={(e) => setRua(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <input className="rounded-xl bg-neutral-900 p-3" placeholder="Número *" value={numero} onChange={(e) => setNumero(e.target.value)} />
          <input className="rounded-xl bg-neutral-900 p-3" placeholder="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
        </div>
        <input className="w-full rounded-xl bg-neutral-900 p-3" placeholder="Bairro *" value={bairro} onChange={(e) => setBairro(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <input className="rounded-xl bg-neutral-900 p-3" placeholder="Cidade *" value={cidade} onChange={(e) => setCidade(e.target.value)} />
          <input className="rounded-xl bg-neutral-900 p-3" placeholder="Estado *" value={estado} onChange={(e) => setEstado(e.target.value)} />
        </div>
      </div>

      {/* Finalizar compra (WhatsApp) */}
      <div className="mt-8 flex gap-4">
        <a
          href={linkWhats}
          target="_blank"
          className="flex-1 rounded-2xl bg-emerald-600 py-4 text-center text-lg font-semibold text-white hover:bg-emerald-500"
        >
          Finalizar compra no WhatsApp
        </a>
        <Link
          href="/"
          className="flex-1 rounded-2xl border border-white/20 py-4 text-center text-lg"
        >
          Voltar para a loja
        </Link>
      </div>
    </div>
  );
}