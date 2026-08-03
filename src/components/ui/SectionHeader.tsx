"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/animations";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  id?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  id,
}: SectionHeaderProps) {
  return (
    <motion.div
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`mb-10 sm:mb-14 ${align === "center" ? "text-center mx-auto" : ""}`}
    >
      <h2 className="section-heading text-balance">{title}</h2>
      {subtitle && (
        <p
          className={`section-subheading mt-4 ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
