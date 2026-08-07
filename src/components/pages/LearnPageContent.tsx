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

        <div className="aspect-video rounded-2xl bg-gradient-to-br from-emerald-500/15 to-sky-500/15 flex flex-col items-center justify-center mb-8 shadow-card border border-dashed border-slate-700">
          <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 shadow-card opacity-60">
            <Play className="w-8 h-8 text-emerald-400/60 ml-1" />
          </div>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
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
