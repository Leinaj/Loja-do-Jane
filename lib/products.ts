// lib/products.ts
export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;      // em centavos
  image: string;      // caminho em /public
  description: string;
  brand?: string;
  badges?: string[];
};

export const products: Product[] = [
  { id:"bone", slug:"bone", name:"Boné", price:5990, image:"/bone.jpg", description:"Boné aba curva, regulável, acabamento de qualidade." },
  { id:"moletom", slug:"moletom", name:"Moletom", price:15990, image:"/moletom.jpg", description:"Moletom felpado, confortável e estiloso." },
  { id:"camiseta-preta", slug:"camiseta-preta", name:"Camiseta Preta", price:6990, image:"/camiseta-preta.jpg", description:"Camiseta 100% algodão, malha premium." },
  { id:"camiseta-branca", slug:"camiseta-branca", name:"Camiseta Branca", price:6990, image:"/camiseta-branca.jpg", description:"Camiseta 100% algodão, respirável." },
];

export const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const findBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);
