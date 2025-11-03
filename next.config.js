/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },        // placeholder simples
      { protocol: 'https', hostname: 'images.unsplash.com' }, // se quiser usar unsplash
      { protocol: 'https', hostname: 'i.imgur.com' },         // imgur
      { protocol: 'https', hostname: 'cdn.shopify.com' }      // opcional
    ],
  },
};

module.exports = nextConfig;
