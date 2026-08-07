import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          accent: "var(--color-accent)",
          green: "#059669",
          "green-light": "#10B981",
          "blue-dark": "#0F172A",
          "blue-mid": "#1E3A5F",
          white: "#FAFBFC",
          glass: "rgba(255, 255, 255, 0.72)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      spacing: {
        section: "6rem",
        "section-sm": "4rem",
      },
      borderRadius: {
        card: "1.25rem",
        button: "0.875rem",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
        card: "0 8px 32px -8px rgba(15, 23, 42, 0.12)",
        glow: "0 0 40px -10px rgba(5, 150, 105, 0.35)",
        glass: "0 8px 32px rgba(31, 38, 135, 0.12)",
      },
      backgroundImage: {
        "gradient-solar":
          "linear-gradient(135deg, #2E7D32 0%, #388E3C 45%, #0288D1 100%)",
        "gradient-hero":
          "linear-gradient(180deg, rgba(250,251,252,0) 0%, rgba(250,251,252,1) 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
