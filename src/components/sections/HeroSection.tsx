"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { fadeUp, fadeRight, staggerContainer } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-slate-800/70 backdrop-blur border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-6"
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

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <Link href="/calculator" className="btn-primary ripple">
              {t.hero.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/#learn" className="btn-secondary ripple">
              {t.hero.ctaSecondary}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        variants={fadeRight}
        initial="hidden"
        animate="visible"
        className="hidden xl:block absolute right-16 top-1/2 -translate-y-1/2"
      >
        <div className="w-72 h-72 rounded-full bg-gradient-solar opacity-10 blur-2xl" />
      </motion.div>
    </section>
  );
}
