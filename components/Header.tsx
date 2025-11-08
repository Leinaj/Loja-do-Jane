"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartContext"; // mantém como está no seu projeto

export default function Header() {
  const pathname = usePathname();
  const { getCartCount } = useCart();

  const nav = [
    { href: "/", label: "Home" },
    { href: "/checkout", label: "Checkout" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          <span className="text-white">Loja da Jane</span>
        </Link>

        <nav className="hidden gap-2 sm:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? "bg-white/10 text-white" : "text-neutral-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/checkout" className="btn">
          Carrinho · {getCartCount()}
        </Link>
      </div>
    </header>
  );
}