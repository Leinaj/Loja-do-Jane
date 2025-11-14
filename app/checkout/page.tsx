"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../contexts/CartContext";

export default function CheckoutPage() {
  const { items, total, removeItem, clear } = useCart();

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  // Buscar endereço automático ao digitar CEP
  useEffect(() => {
    const fetchCep = async () => {
      if (cep.length === 9) {
        const clean = cep.replace("-", "");
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();

        if (!data.erro) {
          setRua(data.logradouro || "");
          setBairro(data.bairro || "");
          setCidade(data.localidade || "");
          setUf(data.uf || "");
        }
      }
    };
    fetchCep();
  }, [cep]);

  // Enviar pedido pelo WhatsApp
  const enviarWhats = () => {
    const pedido = items
      .map((i) => `${i.product.name} — Qtd: ${i.quantity}`)
      .join("%0A");

    const mensagem = `
*Pedido Loja do Jane*%0A%0A
*Nome:* ${nome}%0A
*Telefone:* ${telefone}%0A
*CEP:* ${cep}%0A
*Rua:* ${rua}, Nº ${numero}%0A
*Compl:* ${complemento}%0A
*Bairro:* ${bairro}%0A
*Cidade:* ${cidade} - ${uf}%0A%0A
*Itens:*%0A${pedido}%0A%0A
*Total:* R$ ${total.toFixed(2).replace(".", ",")}
`;

    window.open(
      `https://wa.me/5544988606483?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  };

  // CLASSE DO GLOW PARA INPUTS
  const inputClass =
    "w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white outline-none transition-all shadow-[0_0_12px_rgba(0,255,100,0.15)] focus:shadow-[0_0_18px_rgba(0,255,150,0.45)]";

  const rowClass = "flex flex-col gap-2 mb-4";

  return (
    <div className="max-w-2xl mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Carrinho</h1>

      {/* LISTA DE PRODUTOS */}
      <div className="flex flex-col gap-4 mb-10">
        {items.map((item) => (
          <div
            key={item.product.slug}
            className="flex items-center justify-between bg-zinc-900 p-4 rounded-3xl border border-zinc-800"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm opacity-70">
                  Qtd: {item.quantity} — R$ {item.product.price}
                </p>
              </div>
            </div>

            <button
              onClick={() => removeItem(item.product.slug)}
              className="bg-pink-600 px-4 py-2 rounded-2xl"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10">
        <div className="flex justify-between text-xl font-semibold mb-6">
          <span>Total:</span>
          <span className="text-emerald-400">
            R$ {total.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <button
          onClick={clear}
          className="w-full mb-3 py-3 rounded-2xl bg-zinc-800"
        >
          Limpar carrinho
        </button>

        <button
          onClick={enviarWhats}
          className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold"
        >
          Finalizar compra no WhatsApp
        </button>

        <Link
          href="/"
          className="block w-full mt-3 py-3 rounded-2xl border border-emerald-500 text-center text-emerald-400"
        >
          Voltar para a loja
        </Link>
      </div>

      {/* FORMULÁRIO DE ENDEREÇO */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6">Endereço</h2>

        <div className={rowClass}>
          <label>Nome *</label>
          <input
            placeholder="Nome completo"
            className={inputClass}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className={rowClass}>
          <label>Telefone / WhatsApp *</label>
          <input
            placeholder="(44) 9 9999-9999"
            className={inputClass}
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className={rowClass}>
          <label>CEP *</label>
          <input
            placeholder="87000-000"
            className={inputClass}
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            maxLength={9}
          />
        </div>

        <div className={rowClass}>
          <label>Rua *</label>
          <input
            className={inputClass}
            value={rua}
            onChange={(e) => setRua(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1 flex flex-col gap-2">
            <label>Número *</label>
            <input
              className={inputClass}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <label>Complemento</label>
            <input
              placeholder="Apto, bloco, referência"
              className={inputClass}
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </div>
        </div>

        <div className={rowClass}>
          <label>Bairro *</label>
          <input
            className={inputClass}
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2 mb-4">
            <label>Cidade *</label>
            <input
              className={inputClass}
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>

          <div className="w-24 flex flex-col gap-2 mb-4">
            <label>UF *</label>
            <input
              className={inputClass}
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              maxLength={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}