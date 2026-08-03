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
              <Link href={`/learn/${card.slug}`} className="group block card-interactive h-full">
                <div className="relative aspect-video rounded-xl bg-gradient-to-br from-emerald-100/80 to-sky-100/80 mb-4 overflow-hidden border border-white/60">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-card opacity-60">
                      <Play className="w-6 h-6 text-emerald-600/60 ml-0.5" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.common.videoComingSoon}
                    </span>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg text-solar-blue-dark">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
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
