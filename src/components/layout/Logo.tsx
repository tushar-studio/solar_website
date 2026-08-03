"use client";

import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/data";

interface LogoProps {
  size?: "sm" | "md";
  showName?: boolean;
  variant?: "light" | "dark";
}

export function Logo({ size = "md", showName = true, variant = "dark" }: LogoProps) {
  const dim = size === "sm" ? 36 : 40;
  const isLight = variant === "light";

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div
        className="relative rounded-xl overflow-hidden shadow-soft group-hover:scale-105 transition-transform flex-shrink-0"
        style={{ width: dim, height: dim }}
      >
        <Image
          src={company.logo}
          alt={`${company.name} logo`}
          fill
          className="object-cover"
          priority
        />
      </div>
      {showName && (
        <div className="hidden sm:block min-w-0">
          <span
            className={`font-display font-bold text-base sm:text-lg block leading-tight ${
              isLight ? "text-white" : "text-solar-blue-dark"
            }`}
          >
            {company.name}
          </span>
          <span
            className={`text-[10px] sm:text-xs font-medium truncate block ${
              isLight ? "text-emerald-400" : "text-emerald-700"
            }`}
          >
            {company.tagline}
          </span>
        </div>
      )}
    </Link>
  );
}
