import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          primary: "#16a34a",
          accent: "#059669",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        "leaf-primary": "#16a34a",
        "leaf-accent": "#059669",
        "leaf-warning": "#eab308",
        "leaf-alert": "#dc2626",
        "leaf-dark": "#0b1329",
        "leaf-light": "#f8fafc",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 25px -5px rgba(22, 163, 74, 0.4)",
        "glow-lg": "0 0 40px -10px rgba(22, 163, 74, 0.5)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;

