// components/Brands.tsx
import Image from "next/image";

const brands = [
  { src: "/brands/nokia.png", alt: "Nokia" },
  { src: "/brands/canon.png", alt: "Canon" },
  { src: "/brands/samsung.png", alt: "Samsung" },
  { src: "/brands/apple.png", alt: "Apple" },
];

export default function Brands() {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {brands.map((b) => (
            <div
              key={b.alt}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-950"
            >
              <Image src={b.src} alt={b.alt} fill className="object-contain p-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}