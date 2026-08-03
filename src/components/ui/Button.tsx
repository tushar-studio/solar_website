"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary ripple",
  secondary: "btn-secondary ripple",
  ghost: "btn-ghost",
  accent:
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-button bg-amber-500 text-white font-semibold shadow-soft hover:bg-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ripple",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={`${variantClasses[variant]} ${size !== "md" ? sizeClasses[size] : ""} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
