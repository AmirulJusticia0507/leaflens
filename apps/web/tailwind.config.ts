import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "leaf-primary": "#16A34A",
        "leaf-accent": "#059669",
        "leaf-warning": "#EAB308",
        "leaf-alert": "#DC2626",
        "leaf-dark": "#0F172A",
        "leaf-light": "#F8FAFC",
      },
    },
  },
  plugins: [],
};

export default config;
