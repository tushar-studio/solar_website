"use client";

import { motion } from "framer-motion";
import { hoverLift } from "@/lib/animations";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", interactive = false, onClick }: CardProps) {
  if (interactive) {
    return (
      <motion.div
        variants={hoverLift}
        initial="rest"
        whileHover="hover"
        onClick={onClick}
        className={`glass-card ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={`glass-card ${className}`}>{children}</div>;
}
