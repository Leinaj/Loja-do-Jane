import Image from "next/image";

export default function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <div className="relative h-40 overflow-hidden rounded-2xl sm:h-56 md:h-64 lg:h-72">
        <Image src="/banner.jpg" alt="Promoções da Loja da Jane" fill className="object-cover object-center" priority />
      </div>
    </div>
  );
}