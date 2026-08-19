"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const videoMap: Record<string, string> = {
  "how-solar-works": "/Videos/video-1.mp4",
  "how-we-help-you": "/Videos/video-2.mp4",
  "our-impact": "/Videos/video-3.mp4",
  "installation-process": "/Videos/video-4.mp4",
  "maintenance-guide": "/Videos/video-5.mp4",
};

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
                <div className="relative aspect-video rounded-2xl bg-slate-900 mb-4 overflow-hidden border border-slate-100 dark:border-slate-800">
                  <video
                    src={videoMap[card.slug] || "/Videos/video-1.mp4"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
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
