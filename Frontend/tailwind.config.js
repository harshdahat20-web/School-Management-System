/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        // Main background
        cream: "#F5F7FA",
        background: "#F5F7FA",

        // Sidebar
        sidebar: {
          DEFAULT: "#211E54",
          hover: "#2B2766",
          active: "#FF7518",
          text: "#FFFFFF",
          muted: "#C8C6E8",
        },

        // Orange
        brand: {
          50: "#FFF3E8",
          100: "#FFE1C7",
          500: "#FF7518",
          600: "#F26300",
          700: "#D95400",
        },

        // Purple / Login button
        indigo: {
          50: "#F0EFFF",
          100: "#E3E1FF",
          500: "#5046E5",
          600: "#4638D5",
          700: "#392DB5",
        },

        // Cards
        success: {
          50: "#EEEEFF",
          100: "#E1E0FF",
          500: "#5046E5",
        },

        warning: {
          50: "#FDEDE8",
          100: "#F9DAD2",
          500: "#E85D3F",
        },

        // Text
        ink: {
          900: "#17152B",
          800: "#211E3A",
          700: "#4B4960",
          500: "#77758A",
          400: "#9997A8",
          300: "#D7D6DF",
          200: "#E5E4EA",
          100: "#F1F1F5",
        },

        // Form
        input: {
          border: "#D9DCE5",
          focus: "#5046E5",
          placeholder: "#9A9AA8",
        },
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      boxShadow: {
        card: "0 2px 8px rgba(33, 30, 84, 0.06)",
        soft: "0 4px 16px rgba(33, 30, 84, 0.08)",
      },

      borderRadius: {
        xl2: "14px",
        "2xl": "16px",
      },
    },
  },

  plugins: [],
};
