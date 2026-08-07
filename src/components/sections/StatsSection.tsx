"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/data";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function StatsSection() {
  const { t } = useLanguage();
  const suffixes = t.stats.suffixes;
  type StatLabelKey = Exclude<keyof typeof t.stats, "suffixes">;

  return (
    <section className="py-12 sm:py-16 -mt-8 relative z-10">
      <div className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="glass-card p-6 sm:p-8 lg:p-10 grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {stats.map((stat) => {
            const label = t.stats[stat.key as StatLabelKey];
            const suffix = suffixes[stat.key as keyof typeof suffixes];

            return (
              <motion.div
                key={stat.key}
                variants={fadeUp}
                className="text-center md:text-left"
              >
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text tabular-nums tracking-tight leading-none">
                  {stat.numeric && !stat.value.includes("[DATA") ? (
                    <AnimatedCounter value={stat.value} suffix={suffix} />
                  ) : (
                    `${stat.value}${suffix}`
                  )}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-snug">{label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
