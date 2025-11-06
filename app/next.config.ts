// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // { protocol: "https", hostname: "SEU-DOMINIO-DE-IMAGEM.com" },
    ],
  },
};
export default nextConfig;