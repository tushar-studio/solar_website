"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Play } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LearnPageContent({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const card = t.content.learnCards.find((c) => c.slug === slug);
  if (!card) return null;

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container max-w-4xl">
        <Link
          href="/#learn"
          className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.pages.learn.backHome}
        </Link>

        <h1 className="section-heading mb-4">{card.title}</h1>
        <p className="section-subheading mb-8">{card.description}</p>

        <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-800/60 dark:to-slate-900/60 flex flex-col items-center justify-center mb-8 shadow-card border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
            <Play className="w-8 h-8 ml-1" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t.pages.learn.videoGuide}
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 text-slate-500 leading-relaxed">
          <p className="font-medium text-solar-blue-dark mb-2">{card.title}</p>
          <p>{card.description}</p>
          <p className="mt-4">{t.pages.learn.consultationNote}</p>
        </div>
      </div>
    </div>
  );
}
