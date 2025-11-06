/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { lg: "1024px", xl: "1120px", "2xl": "1120px" },
    },
    extend: {},
  },
  plugins: [],
};