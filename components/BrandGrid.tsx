import Image from "next/image";

export default function BrandGrid() {
  const brands = [
    { src: "/brands/nokia.png", alt: "Nokia" },
    { src: "/brands/canon.png", alt: "Canon" },
    { src: "/brands/samsung.png", alt: "Samsung" },
    { src: "/brands/apple.png", alt: "Apple" },
  ];
  // Dica: se não tiver essas imagens, remova esta seção
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {brands.map((b) => (
          <div key={b.alt} className="flex items-center justify-center rounded-xl bg-zinc-800/40 p-6">
            <Image src={b.src} alt={b.alt} width={160} height={80} className="h-auto w-auto object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
}