"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const videoMap: Record<string, string> = {
  "how-solar-works": "/Videos/video-1.mp4",
  "how-we-help-you": "/Videos/video-2.mp4",
  "our-impact": "/Videos/video-3.mp4",
  "installation-process": "/Videos/video-4.mp4",
  "maintenance-guide": "/Videos/video-5.mp4",
};

export function LearnPageContent({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const card = t.content.learnCards.find((c) => c.slug === slug);
  if (!card) return null;

  const videoSrc = videoMap[slug] || "/Videos/video-1.mp4";

  return (
    <div className="pt-28 pb-16 sm:pb-24">
      <div className="section-container max-w-4xl">
        <Link
          href="/#learn"
          className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.pages.learn.backHome}
        </Link>

        <h1 className="section-heading mb-4">{card.title}</h1>
        <p className="section-subheading mb-8">{card.description}</p>

        <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-card border border-slate-100 dark:border-slate-800 bg-slate-900">
          <video
            src={videoSrc}
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
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
