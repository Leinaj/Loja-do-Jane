// components/Footer.tsx
import { STORE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-zinc-400">
        © {new Date().getFullYear()} {STORE.name} — feito com amor 💚
      </div>
    </footer>
  );
}