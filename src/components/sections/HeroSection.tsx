"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { HeroBannerCarousel } from "@/components/sections/HeroBannerCarousel";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[100svh] flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl" />
        <div className="ambient-overlay" />
      </div>

      <div className="section-container w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300 text-sm font-semibold shadow-sm mb-6 transition-all"
          >
            <Zap className="w-4 h-4" />
            {t.hero.badge}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-solar-blue-dark text-balance leading-[1.1]"
          >
            {t.hero.headline}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed"
          >
            {t.hero.subheadline}
          </motion.p>
        </motion.div>

        {/* 10-banner auto-sliding carousel — under the hero text, above the stats bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 sm:mt-14"
        >
          <HeroBannerCarousel />
        </motion.div>
      </div>
    </section>
  );
}
