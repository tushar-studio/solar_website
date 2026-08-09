"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Landmark, ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, fadeLeft, viewportOnce } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function GovernmentSubsidySection() {
  const { t } = useLanguage();
  const topics = t.content.subsidyTopics;

  return (
    <section id="subsidy" className="py-section-sm sm:py-section scroll-mt-24">
      <div className="section-container">
        <SectionHeader title={t.sections.subsidyTitle} subtitle={t.sections.subsidySubtitle} />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="glass-card p-6 sm:p-8 lg:p-10"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Landmark className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-solar-blue-dark mb-4">
                {t.subsidy.overview}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-3">{t.content.subsidyInfo.summary}</p>
              <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 mb-6 inline-block">
                {t.content.subsidyInfo.verifyNote}
              </p>
              <Link href="/subsidy" className="btn-primary ripple inline-flex">
                {t.common.applyNow}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topics.map((topic, i) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/subsidy#${topic.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-md shadow-slate-200/40 dark:shadow-black/30 hover:border-emerald-500 hover:shadow-card transition-all duration-300 group"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {topic}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
