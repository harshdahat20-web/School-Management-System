/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#1B2541",
          hover: "#2A3658",
          active: "#2E5BFF",
        },
        brand: {
          50: "#EFF4FF",
          100: "#DCE7FF",
          500: "#2E5BFF",
          600: "#2547D6",
          700: "#1D39AD",
        },
        ink: {
          900: "#0F172A",
          700: "#334155",
          500: "#64748B",
          300: "#CBD5E1",
          100: "#F1F5F9",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};
