export default function Badges() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl bg-sky-950/40 p-5">
        <p className="text-lg font-semibold">30 dias para troca</p>
        <p className="text-zinc-400">Sem estresse</p>
      </div>
      <div className="rounded-2xl bg-amber-950/40 p-5">
        <p className="text-lg font-semibold">Frete grátis*</p>
        <p className="text-zinc-400">Consulte condições</p>
      </div>
      <div className="rounded-2xl bg-rose-950/40 p-5">
        <p className="text-lg font-semibold">Pagamentos seguros</p>
        <p className="text-zinc-400">Pix, Cartão</p>
      </div>
    </div>
  );
}