"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { company } from "@/lib/data";

export function PageLoader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use CSS animation + requestAnimationFrame for smooth fade out
    // After animation completes, remove from DOM via display: none
    const timer = setTimeout(() => {
      el.style.transition = "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      const cleanup = setTimeout(() => {
        el.style.display = "none";
      }, 500);
      return () => clearTimeout(cleanup);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-solar-white"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden solar-loader-icon shadow-glow ring-4 ring-emerald-100">
          <Image src={company.logo} alt={company.name} fill className="object-cover" priority />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="font-display font-semibold text-solar-blue-dark">{company.name}</p>
          <p className="text-xs text-emerald-600">{company.tagline}</p>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-emerald-600 inline-block"
                style={{ animation: `solarPulse 1s ease-in-out infinite ${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
