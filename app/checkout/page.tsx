"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../cart-provider";

type CepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export default function CheckoutPage() {
  const { items, total, removeItem, clear } = useCart();

  const [nome, setNome] = useState("");
  const [whats, setWhats] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState<string | null>(null);

  const hasItems = items.length > 0;

  async function handleBuscarCep() {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setErroCep("CEP inválido. Use 8 números.");
      return;
    }

    try {
      setErroCep(null);
      setBuscandoCep(true);

      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: CepResponse = await res.json();

      if (data.erro) {
        setErroCep("CEP não encontrado.");
        return;
      }

      setRua(data.logradouro ?? "");
      setBairro(data.bairro ?? "");
      setCidade(data.localidade ?? "");
      setEstado(data.uf ?? "");
    } catch (e) {
      setErroCep("Erro ao buscar CEP. Tente novamente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!hasItems) return;

    if (!nome || !whats || !cep || !rua || !bairro || !cidade || !estado) {
      alert("Preencha todos os dados principais (nome, WhatsApp, endereço).");
      return;
    }

    const itensTexto = items
      .map(
        (item) =>
          `• ${item.name} (Qtd: ${item.quantity}) - R$ ${(item.price * item.quantity)
            .toFixed(2)
            .replace(".", ",")}`
      )
      .join("%0A");

    const totalTexto = total.toFixed(2).replace(".", ",");

    const endereco = `${rua}, ${numero || "s/ nº"} - ${bairro} - ${cidade}/${estado}`;
    const complementoTexto = complemento ? ` (${complemento})` : "";

    const msg = `Novo pedido - Loja do Jane%0A%0A` +
      `Nome: ${nome}%0A` +
      `WhatsApp: ${whats}%0A` +
      `CEP: ${cep}%0A` +
      `Endereço: ${endereco}${complementoTexto}%0A%0A` +
      `Itens:%0A${itensTexto}%0A%0A` +
      `Total: R$ ${totalTexto}`;

    const url = `https://wa.me/5544988606483?text=${msg}`;

    window.open(url, "_blank");

    clear();
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        {/* COLUNA ESQUERDA – ITENS DO CARRINHO */}
        <div className="w-full lg:w-2/3 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-white">
              Finalizar pedido
            </h1>

            <Link
              href="/"
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              ← Voltar para a loja
            </Link>
          </div>

          {!hasItems && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 text-sm text-zinc-300">
              Seu carrinho está vazio.  
              <Link href="/" className="text-emerald-400 ml-1">
                Ver produtos
              </Link>
            </div>
          )}

          {hasItems && (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-zinc-950">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Quantidade: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-emerald-400">
                      R$ {(item.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-zinc-400 hover:text-red-400"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA – DADOS E RESUMO */}
        <div className="w-full lg:w-1/3 space-y-4">
          {/* RESUMO */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white">
              Resumo do pedido
            </h2>

            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Total</span>
              <span className="text-lg font-semibold text-emerald-400">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <p className="text-xs text-zinc-500">
              O frete e forma de pagamento serão combinados pelo WhatsApp.
            </p>
          </div>

          {/* FORMULÁRIO */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5"
          >
            <h2 className="text-sm font-semibold text-white">
              Dados para entrega
            </h2>

            {/* NOME */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Nome completo</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                placeholder="Seu nome"
              />
            </div>

            {/* WHATS */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">WhatsApp</label>
              <input
                value={whats}
                onChange={(e) => setWhats(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                placeholder="(44) 9 9999-9999"
              />
            </div>

            {/* CEP */}
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs text-zinc-400">CEP</label>
                  <input
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                    placeholder="87000-000"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleBuscarCep}
                  disabled={buscandoCep}
                  className="mt-[18px] rounded-xl bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-100 outline-none transition hover:bg-zinc-700 disabled:opacity-60"
                >
                  {buscandoCep ? "Buscando..." : "Buscar CEP"}
                </button>
              </div>
              {erroCep && (
                <p className="text-xs text-red-400">{erroCep}</p>
              )}
            </div>

            {/* RUA / NÚMERO */}
            <div className="flex gap-2">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs text-zinc-400">Rua</label>
                <input
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <div className="w-24 space-y-1.5">
                <label className="text-xs text-zinc-400">Número</label>
                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            {/* BAIRRO / CIDADE / UF */}
            <div className="flex gap-2">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs text-zinc-400">Bairro</label>
                <input
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-xs text-zinc-400">Cidade</label>
                <input
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              <div className="w-16 space-y-1.5">
                <label className="text-xs text-zinc-400">UF</label>
                <input
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 uppercase outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  maxLength={2}
                />
              </div>
            </div>

            {/* COMPLEMENTO */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400">Complemento</label>
              <input
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                placeholder="Apartamento, bloco, ponto de referência..."
              />
            </div>

            <button
              type="submit"
              disabled={!hasItems}
              className="mt-2 w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(16,185,129,0.55)] transition hover:bg-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] disabled:opacity-60 disabled:shadow-none"
            >
              Enviar pedido no WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}