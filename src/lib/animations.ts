import type { Variants } from "framer-motion";

/** Physics-based spring defaults (smooth, slightly elastic, GPU-friendly) */
const spring = { type: "spring", stiffness: 300, damping: 25 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring,
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring,
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: spring,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const hoverLift = {
  rest: { y: 0, boxShadow: "0 8px 32px -8px rgba(15, 23, 42, 0.12)" },
  hover: {
    y: -6,
    boxShadow: "0 16px 48px -12px rgba(15, 23, 42, 0.18)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const viewportOnce = { once: true, margin: "-80px" as const };
