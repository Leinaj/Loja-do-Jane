// lib/site.ts
export const site = {
  name: "Loja do Jane",
  description: "Produtos selecionados com preço justo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://loja-do-jane.vercel.app",
  whatsapp: "5544988606483", // E.164 sem '+'
};
