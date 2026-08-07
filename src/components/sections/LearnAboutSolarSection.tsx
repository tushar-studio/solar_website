"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LearnAboutSolarSection() {
  const { t } = useLanguage();
  const cards = t.content.learnCards;

  return (
    <section id="learn" className="py-section-sm sm:py-section">
      <div className="section-container">
        <SectionHeader title={t.sections.learnTitle} subtitle={t.sections.learnSubtitle} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {cards.map((card) => (
            <motion.div key={card.slug} variants={fadeUp}>
              <Link
                href={`/learn/${card.slug}`}
                className="group block h-full bg-white border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800 rounded-3xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-black/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-800/60 dark:to-slate-900/60 mb-4 overflow-hidden border border-slate-100 dark:border-slate-800">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-6 h-6 ml-0.5" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.common.videoComingSoon}
                    </span>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-slate-100">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
