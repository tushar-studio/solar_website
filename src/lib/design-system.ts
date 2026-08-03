/**
 * Design System — Solar Web
 * Modern Solar theme (Green / White / Dark Blue).
 */

export const colors = {
  primary: "#2E7D32",
  secondary: "#0288D1",
  accent: "#F59E0B",
  // Provisional implementation tokens
  green: "#059669",
  greenLight: "#10B981",
  greenDark: "#047857",
  blueDark: "#0F172A",
  blueMid: "#1E3A5F",
  white: "#FAFBFC",
  gray50: "#F8FAFC",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  gray400: "#94A3B8",
  gray600: "#475569",
  gray800: "#1E293B",
} as const;

export const typography = {
  fontSans: "Inter",
  fontDisplay: "Plus Jakarta Sans",
  scale: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
    "7xl": "4.5rem", // 72px
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "6rem",
  section: "6rem",
  sectionSm: "4rem",
} as const;

export const radii = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  card: "1.25rem",
  button: "0.875rem",
  pill: "9999px",
} as const;

export const shadows = {
  soft: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
  card: "0 8px 32px -8px rgba(15, 23, 42, 0.12)",
  glow: "0 0 40px -10px rgba(5, 150, 105, 0.35)",
  glass: "0 8px 32px rgba(31, 38, 135, 0.12)",
} as const;

export const glass = {
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  backdrop: "blur(16px)",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
