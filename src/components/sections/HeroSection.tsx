"use client";

import { motion } from "framer-motion";
import { Zap, Pencil } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSiteConfig } from "@/lib/config/SiteConfigProvider";
import { HeroBannerCarousel } from "@/components/sections/HeroBannerCarousel";

export function HeroSection() {
  const { t } = useLanguage();
  const { config, isAdminUnlocked, openEditor } = useSiteConfig();

  const badgeText = config.hero?.badge || t.hero.badge;
  const headlineText = config.hero?.headline || t.hero.headline;
  const subheadlineText = config.hero?.subheadline || t.hero.subheadline;

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
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300 text-sm font-semibold shadow-sm transition-all"
            >
              <Zap className="w-4 h-4" />
              {badgeText}
            </motion.div>

            {isAdminUnlocked && (
              <button
                type="button"
                onClick={() => openEditor("hero")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-pill text-xs font-bold shadow-sm transition-all cursor-pointer backdrop-blur-sm"
                title="Edit Headline, Subheadline, Buttons & SEO"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Hero &amp; SEO</span>
              </button>
            )}
          </div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-solar-blue-dark text-balance leading-[1.1]"
          >
            {headlineText}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed"
          >
            {subheadlineText}
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
