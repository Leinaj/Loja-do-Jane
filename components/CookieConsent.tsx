
// components/CookieConsent.tsx
"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const ok = localStorage.getItem("cookieConsent");
      if (!ok) setOpen(true);
    } catch {}
  }, []);
  if (!open) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-zinc-900/95 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-center">
        <p className="text-sm text-zinc-300">
          Usamos cookies básicos para melhorar sua experiência.{" "}
          <a href="/politica-privacidade" className="underline text-zinc-100">
            Saiba mais
          </a>
          .
        </p>
        <div className="sm:ml-auto flex gap-2">
          <button
            onClick={() => {
              localStorage.setItem("cookieConsent", "true");
              setOpen(false);
            }}
            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Aceitar
          </button>
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
