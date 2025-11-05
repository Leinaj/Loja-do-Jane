
// components/FloatingWhatsApp.tsx
"use client";

const PHONE = "5544988606483"; // seu número em E.164

export default function FloatingWhatsApp() {
  const text = encodeURIComponent("Olá! Quero tirar uma dúvida 🙂");
  const href = `https://wa.me/${PHONE}?text=${text}`;
  return (
    <a
      href={href}
      target="_blank"
      className="fixed bottom-4 right-4 z-50 rounded-full px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg border border-emerald-700"
      aria-label="Falar no WhatsApp"
    >
      WhatsApp
    </a>
  );
}
