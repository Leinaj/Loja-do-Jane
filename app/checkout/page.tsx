'use client';
export const dynamic = 'force-dynamic';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// importa o hook do carrinho normalmente e faz o cast depois
import { useCart as useCartBase } from '@/components/cart/context';

// Componentes de UI (ajuste os caminhos se precisar)
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type Endereco = {
  nome: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export default function CheckoutPage() {
  // cast para any aqui, não no import
  const cart = (useCartBase() as any) || {};
  const items = cart.items ?? [];

  // formulário de endereço
  const [end, setEnd] = useState<Endereco>({
    nome: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  // cupom
  const [cupom, setCupom] = useState<string>('');
  const [cupomValido, setCupomValido] = useState<boolean>(false);

  // frete (simples)
  const [frete, setFrete] = useState<number>(24.4);

  // Subtotal a partir dos itens
  const subtotal = useMemo(() => {
    return (items as any[]).reduce((acc, it) => {
      const price = Number(it?.price ?? it?.preco ?? 0);
      const qty = Number(it?.quantity ?? it?.qty ?? 1);
      return acc + price * qty;
    }, 0);
  }, [items]);

  const desconto = cupomValido ? subtotal * 0.1 : 0; // JANE10 = 10%
  const total = Math.max(0, subtotal - desconto) + (items.length ? frete : 0);

  // Autopreenche via CEP (opcional)
  useEffect(() => {
    const cep = end.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    let cancel = false;
    (async () => {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!cancel && !data.erro) {
          setEnd((e) => ({
            ...e,
            rua: data.logradouro || e.rua,
            bairro: data.bairro || e.bairro,
            cidade: data.localidade || e.cidade,
            estado: data.uf || e.estado,
          }));
        }
      } catch {}
    })();
    return () => {
      cancel = true;
    };
  }, [end.cep]);

  // Handlers
  const aplicarCupom = () => {
    if (cupom.trim().toUpperCase() === 'JANE10') {
      setCupomValido(true);
      cart.applyCoupon?.(cupom.trim());
    } else {
      setCupomValido(false);
    }
  };

  const limparCarrinho = () => cart.clear?.();
  const removerItem = (id: string | number) => cart.removeItem?.(id);

  const alterarQtd = (id: string | number, nextQty: number) => {
    if (nextQty < 1) return;
    cart.updateItemQuantity?.(id, nextQty);
    cart.setQuantity?.(id, nextQty);
    cart.updateItem?.(id, { quantity: nextQty });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 space-y-10">
      <h1 className="text-3xl font-semibold mb-4">Carrinho</h1>

      {/* Lista de itens */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-muted-foreground">Seu carrinho está vazio.</p>
              <Button asChild>
                <Link href="/">Voltar para a loja</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {(items as any[]).map((it) => (
                <div
                  key={String(it.id ?? it.slug)}
                  className="flex items-center gap-4 rounded-xl border p-3"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-black/5">
                    {it.image && (
                      <Image
                        src={it.image}
                        alt={it.name ?? 'Produto'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      {it.name ?? it.title ?? 'Produto'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {brl(Number(it.price ?? it.preco ?? 0))}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        alterarQtd(
                          it.id ?? it.slug,
                          Number(it.quantity ?? 1) - 1
                        )
                      }
                    >
                      –
                    </Button>
                    <span className="w-8 text-center">
                      {Number(it.quantity ?? 1)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        alterarQtd(
                          it.id ?? it.slug,
                          Number(it.quantity ?? 1) + 1
                        )
                      }
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => removerItem(it.id ?? it.slug)}
                  >
                    Remover
                  </Button>
                </div>
              ))}

              <div className="flex justify-between">
                <Button variant="outline" onClick={limparCarrinho}>
                  Limpar carrinho
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/">Voltar para a loja</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Endereço + Resumo */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Endereço */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Endereço</h2>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Nome *</Label>
              <Input
                value={end.nome}
                onChange={(e) => setEnd({ ...end, nome: e.target.value })}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone *</Label>
              <Input
                value={end.telefone}
                onChange={(e) =>
                  setEnd({ ...end, telefone: e.target.value })
                }
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label>CEP *</Label>
              <Input
                value={end.cep}
                onChange={(e) => setEnd({ ...end, cep: e.target.value })}
                placeholder="00000-000"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Rua *</Label>
              <Input
                value={end.rua}
                onChange={(e) => setEnd({ ...end, rua: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Número *</Label>
              <Input
                value={end.numero}
                onChange={(e) => setEnd({ ...end, numero: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input
                value={end.complemento}
                onChange={(e) =>
                  setEnd({ ...end, complemento: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro *</Label>
              <Input
                value={end.bairro}
                onChange={(e) => setEnd({ ...end, bairro: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade *</Label>
              <Input
                value={end.cidade}
                onChange={(e) => setEnd({ ...end, cidade: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Estado *</Label>
              <Input
                value={end.estado}
                onChange={(e) => setEnd({ ...end, estado: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Resumo</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cupom de desconto</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="JANE10"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                />
                <Button onClick={aplicarCupom}>Aplicar</Button>
              </div>
              {cupomValido ? (
                <p className="text-sm text-emerald-500">
                  Cupom aplicado: 10% de desconto
                </p>
              ) : cupom ? (
                <p className="text-sm text-muted-foreground">
                  Dica: use <b>JANE10</b> para 10% OFF
                </p>
              ) : null}
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{brl(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto</span>
                <span>– {brl(desconto)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete • PAC (5–8 dias)</span>
                <span>{items.length ? brl(frete) : brl(0)}</span>
              </div>
              <div className="mt-2 border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{brl(total)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" disabled={!items.length}>
              Finalizar pedido
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}