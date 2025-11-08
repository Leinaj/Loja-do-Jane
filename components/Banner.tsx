'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Banner() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        {/* Imagem do banner em /public/banner.jpg */}
        <Image
          src="/banner.jpg"
          alt="Promo relâmpago — até 50% OFF"
          width={2400}
          height={800}
          className="h-56 w-full object-cover md:h-72"
          priority
        />

        {/* Conteúdo/CTA por cima da imagem */}
        <div className="absolute inset-0 flex items-center">
          <div className="p-6 md:p-10">
            <h2 className="text-2xl font-semibold text-white drop-shadow md:text-3xl">
              Promo relâmpago ⚡
            </h2>
            <p className="mt-1 text-white/80">
              Até 50% OFF em itens selecionados.
            </p>

            <div className="mt-4 flex gap-3">
              <Link
                href="/#produtos"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Ver ofertas
              </Link>
              <Link
                href="/checkout"
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
              >
                Ir para o checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}