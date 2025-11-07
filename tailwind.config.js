/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1200px" },
    },
    extend: {
      colors: {
        brand: {
          50:  "#f1fff8",
          100: "#dcffe9",
          200: "#b9ffd4",
          300: "#8affba",
          400: "#4cf097",
          500: "#17c471",   // cor principal
          600: "#0ea561",
          700: "#0a8350",
          800: "#086744",
          900: "#064f37",
        },
      },
      boxShadow: {
        card: "0 12px 32px -12px rgba(0,0,0,0.35)",
        soft: "0 6px 18px -6px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};