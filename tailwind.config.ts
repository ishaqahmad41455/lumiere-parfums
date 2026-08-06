import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        noir: {
          DEFAULT: "#0B0B0C",
          50: "#F5F4F3",
          100: "#E4E2E0",
          400: "#5B5854",
          600: "#2A2926",
          800: "#151413",
          900: "#0B0B0C",
        },
        cream: {
          DEFAULT: "#F6F1E7",
          50: "#FFFDF9",
          100: "#F6F1E7",
          200: "#EDE4D0",
        },
        gold: {
          DEFAULT: "#C9A227",
          50: "#F7EFD4",
          200: "#E4C767",
          400: "#C9A227",
          600: "#9A7A1B",
          900: "#3D3009",
        },
        bordeaux: "#5A1420",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(115deg, #9A7A1B 0%, #E4C767 25%, #C9A227 45%, #F7EFD4 55%, #C9A227 70%, #9A7A1B 100%)",
        "noir-radial":
          "radial-gradient(ellipse at 50% 0%, #1a1917 0%, #0B0B0C 60%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
