'use client';

export default function WhatsAppButton({
  phone = '5544988606483', // DDI+DDD+numero
  message = 'Olá! Tenho uma dúvida sobre meu pedido.',
}: {
  phone?: string;
  message?: string;
}) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[80] inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-white shadow-lg ring-1 ring-white/10 hover:brightness-110"
      aria-label="Falar no WhatsApp"
    >
      {/* Ícone simples */}
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 .02 5.35.02 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.22-1.63a12 12 0 0017.8-10.41c0-3.2-1.25-6.22-3.5-8.48zM12 22a9.96 9.96 0 01-5.09-1.4l-.36-.21-3.69.97.99-3.6-.23-.37A9.97 9.97 0 1122 12c0 5.51-4.49 10-10 10zm5.45-7.53c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.19.3-.76.97-.94 1.17-.17.2-.35.22-.65.07-1.77-.87-2.93-1.55-4.1-3.5-.31-.54.31-.5.88-1.67.1-.2.05-.36-.03-.51-.08-.15-.66-1.6-.91-2.2-.24-.57-.49-.49-.66-.5h-.57c-.2 0-.51.07-.78.36-.27.3-1.03 1-1.03 2.45s1.06 2.84 1.21 3.04c.15.2 2.09 3.21 5.06 4.5.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z"/>
      </svg>
      <span className="text-sm font-medium">WhatsApp</span>
    </a>
  );
}