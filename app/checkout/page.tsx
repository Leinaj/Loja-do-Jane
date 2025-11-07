"use client";
import { useCart } from "@/components/CartContext";
import { money } from "@/lib/products";
import Link from "next/link";
import { useState } from "react";

export default function Checkout(){
  const { items, total, setQty, remove, clear } = useCart();
  const [sending, setSending] = useState(false);

  const handleFinish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(items.length===0) return alert("Seu carrinho está vazio.");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // Simples: só mostra e limpa. Aqui você pode integrar PIX/WhatsApp depois.
    setSending(true);
    setTimeout(()=>{
      alert(`Pedido recebido!\n\nNome: ${data.nome}\nTotal: ${money(total)}\n\n(Em produção você integraria pagamento/WhatsApp aqui)`);
      clear();
      setSending(false);
    }, 600);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <section className="card">
        <h1 className="h2 mb-4">Dados para entrega</h1>
        <form className="space-y-4" onSubmit={handleFinish}>
          <div>
            <label className="label">Nome completo</label>
            <input className="input" name="nome" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Telefone (WhatsApp)</label>
              <input className="input" name="telefone" />
            </div>
            <div>
              <label className="label">CEP</label>
              <input className="input" name="cep" inputMode="numeric" />
            </div>
          </div>
          <div>
            <label className="label">Endereço</label>
            <input className="input" name="endereco" required />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Número</label>
              <input className="input" name="numero" />
            </div>
            <div className="col-span-2">
              <label className="label">Complemento</label>
              <input className="input" name="complemento" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Cidade</label>
              <input className="input" name="cidade" />
            </div>
            <div>
              <label className="label">Estado</label>
              <input className="input" name="estado" />
            </div>
          </div>

          <button className="btn w-full mt-3" disabled={sending}>
            {sending ? "Finalizando..." : "Finalizar pedido"}
          </button>
          <p className="small mt-2">Ao finalizar, os dados são mostrados e o carrinho limpa. Depois integramos pagamento/PIX/WhatsApp.</p>
        </form>
      </section>

      <section className="card">
        <h2 className="h2 mb-4">Seu carrinho</h2>
        {items.length===0 ? (
          <div>
            <p className="small">Carrinho vazio.</p>
            <Link href="/" className="btn mt-4 inline-block">Voltar às compras</Link>
          </div>
        ):(
          <div className="space-y-4">
            {items.map(({product, qty})=>(
              <div key={product.id} className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div>
                  <p className="font-medium">{product.title}</p>
                  <p className="small">{money(product.price)} • qtd:</p>
                  <div className="mt-1 flex items-center gap-2">
                    <button className="btn-outline w-8" onClick={()=>setQty(product.id, Math.max(1, qty-1))}>-</button>
                    <span>{qty}</span>
                    <button className="btn-outline w-8" onClick={()=>setQty(product.id, qty+1)}>+</button>
                    <button className="btn-outline ml-2" onClick={()=>remove(product.id)}>Remover</button>
                  </div>
                </div>
                <div className="font-semibold">{money(product.price*qty)}</div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="font-semibold">Total</span>
              <span className="h2 text-emerald-400">{money(total)}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}