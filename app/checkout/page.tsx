"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { priceBRL } from "@/lib/products";

type Address = {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  comp: string;
  city: string;
  state: string;
};

const REQUIRED: (keyof Address)[] = ["name", "phone", "cep", "street", "number", "city", "state"];

export default function CheckoutPage() {
  const { items, remove, clear, getCartTotal } = useCart();
  const total = getCartTotal();

  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    comp: "",
    city: "",
    state: ""
  });

  // Autopreencher via CEP (8 dígitos)
  useEffect(() => {
    const digits = address.cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    (async () => {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            city: data.localidade || prev.city,
            state: data.uf || prev.state
          }));
        }
      } catch {}
    })();
  }, [address.cep]);

  const onChange =
    (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddress((prev) => ({ ...prev, [k]: e.target.value }));

  const cartLines = useMemo(
    () =>
      items
        .map(({ product, qty }) => `• ${product.name} — ${qty} × ${priceBRL(product.price)}`)
        .join("\n"),
    [items]
  );

  const validar = () => {
    if (!items.length) {
      alert("Seu carrinho está vazio.");
      return false;
    }
    const faltando = REQUIRED.filter((k) => !String(address[k]).trim());
    if (faltando.length) {
      alert("Preencha os campos obrigatórios: " + faltando.join(", "));
      return false;
    }
    return true;
  };

  const finish = () => {
    if (!validar()) return;

    const msg =
      `*Novo Pedido*\n` +
      `Cliente: ${address.name}\n` +
      `Telefone: ${address.phone}\n` +
      `CEP: ${address.cep}\n` +
      `Endereço: ${address.street}, ${address.number} ${address.comp ? "- " + address.comp : ""}\n` +
      `Cidade/UF: ${address.city}/${address.state}\n\n` +
      `*Itens:*\n${cartLines}\n\n` +
      `*Total:* ${priceBRL(total)}\n` +
      `———\nEnviado pela Loja da Jane`;

    const url = `https://wa.me/5544988606483?text=${encodeURIComponent(msg)}`;

    const abrir = confirm("Abrir o WhatsApp para enviar o pedido?");
    if (!abrir) return;

    // Abre o WhatsApp em uma nova aba
    window.open(url, "_blank");

    // Só limpa o carrinho quando o usuário confirmar que enviou
    const enviado = confirm("Depois de enviar no WhatsApp, clique em OK para limpar o carrinho.");
    if (enviado) {
      clear();
      alert("Pedido finalizado! Obrigado ❤️");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <section className="rounded-2xl border border-zinc-800 p-4">
        <h2 className="h2">Dados para entrega</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <input className="input sm:col-span-2" placeholder="Nome completo *" value={address.name} onChange={onChange("name")} />
          <input className="input" placeholder="Telefone (WhatsApp) *" value={address.phone} onChange={onChange("phone")} />
          <input className="input" placeholder="CEP *" value={address.cep} onChange={onChange("cep")} />
          <input className="input sm:col-span-2" placeholder="Endereço *" value={address.street} onChange={onChange("street")} />
          <input className="input" placeholder="Número *" value={address.number} onChange={onChange("number")} />
          <input className="input" placeholder="Complemento" value={address.comp} onChange={onChange("comp")} />
          <input className="input" placeholder="Cidade *" value={address.city} onChange={onChange("city")} />
          <input className="input" placeholder="Estado *" value={address.state} onChange={onChange("state")} />
        </div>

        <p className="text-sm text-zinc-400 mt-4">
          Os campos com * são obrigatórios. O CEP preenche automaticamente rua/cidade/UF.
        </p>

        <button className="btn w-full mt-4" onClick={finish}>Enviar pedido pelo WhatsApp</button>
      </section>

      <section className="rounded-2xl border border-zinc-800 p-4">
        <h2 className="h2">Seu carrinho</h2>

        {!items.length && (
          <p className="text-zinc-400 mt-3">
            Carrinho vazio. <Link className="underline" href="/">Continuar comprando</Link>
          </p>
        )}

        <div className="mt-3 space-y-3">
          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex items-center justify-between gap-3 border border-zinc-800 rounded-xl p-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-sm text-zinc-400">
                  {qty} × {priceBRL(product.price)}
                </p>
              </div>
              <button onClick={() => remove(product.id)} className="btn-ghost">Remover</button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 border-t border-zinc-800 pt-4">
          <span className="text-zinc-400">Total</span>
          <strong className="text-lg">{priceBRL(total)}</strong>
        </div>
      </section>
    </div>
  );
}