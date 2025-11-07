import Link from "next/link";

export default function NotFound(){
  return (
    <div className="min-h-[50vh] grid place-items-center">
      <div className="text-center space-y-3">
        <h1 className="h1">404 — Página não encontrada</h1>
        <p className="small">Talvez o produto foi renomeado ou removido.</p>
        <Link href="/" className="btn">Voltar para a loja</Link>
      </div>
    </div>
  );
}